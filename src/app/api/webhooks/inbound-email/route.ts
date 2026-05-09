import { NextResponse, type NextRequest } from "next/server";
import env from "@/lib/env";
import { fetchAndParseEmail, extractShopId } from "@/lib/inbound";
import logger from "@/lib/logger";
import { processInboundEmail } from "@/lib/wismo/pipeline";

// SNS subscription/notification handler. Receives one of three message types:
//   - SubscriptionConfirmation: visit SubscribeURL once to confirm
//   - Notification: SES dropped an email; fetch raw MIME from S3 and parse
//   - UnsubscribeConfirmation: ignore
export async function POST(req: NextRequest) {
    const messageType = req.headers.get("x-amz-sns-message-type");
    const topicArn = req.headers.get("x-amz-sns-topic-arn");

    if (topicArn !== env.INBOUND_SNS_TOPIC_ARN) {
        return NextResponse.json({ ok: false }, { status: 403 });
    }

    const body = await req.json();

    if (messageType === "SubscriptionConfirmation") {
        await fetch(body.SubscribeURL);
        return NextResponse.json({ ok: true });
    }

    if (messageType !== "Notification") {
        return NextResponse.json({ ok: true });
    }

    // SES publishes an envelope JSON in Message; the S3 action also nests an
    // `action.objectKey`. Spec: https://docs.aws.amazon.com/ses/latest/dg/receiving-email-notifications-contents.html
    const sesEvent = JSON.parse(body.Message);
    const objectKey: string | undefined =
        sesEvent.receipt?.action?.objectKey ??
        (sesEvent.mail?.messageId ?
            `incoming/${sesEvent.mail.messageId}`
        :   undefined);

    if (!objectKey) {
        return NextResponse.json({ ok: false, reason: "no key" });
    }

    const parsed = await fetchAndParseEmail(env.INBOUND_EMAIL_BUCKET, objectKey);

    const recipients = sesEvent.receipt?.recipients ?? [];
    const shopId = recipients
        .map((r: string) => extractShopId(r))
        .find((id: string | null): id is string => Boolean(id));

    if (!shopId) {
        return NextResponse.json({ ok: false, reason: "no shop" });
    }

    // Spec target: < 5s end-to-end (§Performance Goals). Awaiting keeps the
    // SNS HTTP delivery accountable — if anything throws we return 5xx and
    // SNS will retry. Move to a queue if average latency creeps up.
    try {
        await processInboundEmail(shopId, parsed);
    } catch (err) {
        logger.error("wismo pipeline error", {
            shopId,
            error: (err as Error).message,
        });
        return NextResponse.json(
            { ok: false, reason: "pipeline" },
            { status: 500 }
        );
    }

    return NextResponse.json({ ok: true });
}
