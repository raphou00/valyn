import { createElement } from "react";
import type { ParsedMail } from "mailparser";
import db from "@/lib/db";
import { decrypt } from "@/lib/crypto";
import sendEmail, { type ShopSmtpConfig } from "@/lib/email";
import { t, type Language } from "@/lib/translations";
import WismoReply from "@/components/emails/wismo-reply";
import { isSubscriptionActive } from "@/lib/billing";
import logger from "@/lib/logger";
import { detectIntent, extractOrderName, isSupportedLanguage } from "./detect";
import {
    findOrderByName,
    findRecentOrdersByEmail,
    type WismoOrder,
} from "./shopify-orders";

const senderAddress = (mail: ParsedMail): string =>
    mail.from?.value?.[0]?.address?.toLowerCase() ?? "";

const buildSmtpConfig = (s: {
    smtpHost: string | null;
    smtpPort: number | null;
    smtpSecure: boolean;
    smtpUser: string | null;
    smtpPassEnc: string | null;
    smtpFromName: string | null;
    smtpFromAddress: string | null;
}): ShopSmtpConfig | null => {
    if (
        !s.smtpHost ||
        !s.smtpPort ||
        !s.smtpUser ||
        !s.smtpPassEnc ||
        !s.smtpFromAddress
    ) {
        return null;
    }
    return {
        host: s.smtpHost,
        port: s.smtpPort,
        secure: s.smtpSecure,
        user: s.smtpUser,
        pass: decrypt(s.smtpPassEnc),
        fromName: s.smtpFromName ?? s.smtpFromAddress,
        fromAddress: s.smtpFromAddress,
    };
};

type Identified = {
    order: WismoOrder | null;
    multipleRecent: boolean;
};

const identifyOrder = async (
    shopDomain: string,
    accessToken: string,
    mail: ParsedMail,
    bodyText: string
): Promise<Identified> => {
    // Spec §4 priority: order # in email > customer email match > recent orders.
    const name = extractOrderName(mail.subject ?? "", bodyText);
    if (name) {
        const order = await findOrderByName(shopDomain, accessToken, name);
        if (order) return { order, multipleRecent: false };
    }

    const email = senderAddress(mail);
    if (email) {
        const recent = await findRecentOrdersByEmail(
            shopDomain,
            accessToken,
            email
        );
        if (recent.length > 0) {
            return { order: recent[0], multipleRecent: recent.length > 1 };
        }
    }

    return { order: null, multipleRecent: false };
};

const buildReplyBody = (
    language: Language,
    order: WismoOrder | null,
    multipleRecent: boolean
): { subject: string; body: string } => {
    const tr = t(language);

    if (!order) {
        return { subject: "Order tracking", body: tr.noOrderFound };
    }

    const status = order.fulfillmentStatus?.toUpperCase() ?? "";
    const tracking = order.tracking;

    if (status === "FULFILLED" || tracking?.number || tracking?.url) {
        const inTransit = tr.inTransit({
            orderName: order.name,
            carrier: tracking?.company ?? undefined,
            tracking: tracking?.url ?? tracking?.number ?? undefined,
        });
        const notice =
            multipleRecent ?
                `\n\n${tr.multipleOrdersNotice({ orderName: order.name })}`
            :   "";
        return { subject: `Re: ${order.name}`, body: inTransit + notice };
    }

    return {
        subject: `Re: ${order.name}`,
        body: tr.processing({ orderName: order.name }),
    };
};

export const processInboundEmail = async (
    shopId: string,
    parsed: ParsedMail
): Promise<void> => {
    const shop = await db.shop.findUnique({
        where: { id: shopId },
        include: { settings: true },
    });
    if (!shop || !shop.settings) {
        logger.warn("inbound: shop not found or missing settings", { shopId });
        return;
    }
    if (shop.uninstalledAt) return;

    const subject = parsed.subject ?? "";
    const bodyText = parsed.text ?? "";
    const sender = senderAddress(parsed);
    const inboundMessageId = parsed.messageId ?? null;

    // Idempotency: SNS retries on 5xx + the same SES delivery can be
    // re-published. Bail if we've already processed this Message-ID.
    if (inboundMessageId) {
        const existing = await db.emailLog.findUnique({
            where: { inboundMessageId },
            select: { id: true },
        });
        if (existing) {
            logger.info("inbound: duplicate skipped", {
                shopId,
                inboundMessageId,
            });
            return;
        }
    }

    const intent = detectIntent(subject, bodyText);

    const log = await db.emailLog.create({
        data: {
            shopId: shop.id,
            inboundMessageId,
            senderEmail: sender,
            subject,
            body: bodyText,
            intent,
            status: "PENDING",
            receivedAt: parsed.date ?? new Date(),
        },
    });

    if (intent === "OTHER") {
        await db.emailLog.update({
            where: { id: log.id },
            data: { status: "IGNORED" },
        });
        return;
    }

    if (!isSubscriptionActive(shop.subscriptionStatus)) {
        await db.emailLog.update({
            where: { id: log.id },
            data: {
                status: "IGNORED",
                errorMessage: "no active subscription",
            },
        });
        return;
    }

    if (!shop.settings.autoReplyEnabled) {
        await db.emailLog.update({
            where: { id: log.id },
            data: { status: "IGNORED", errorMessage: "auto-reply disabled" },
        });
        return;
    }

    const smtp = buildSmtpConfig(shop.settings);
    if (!smtp) {
        await db.emailLog.update({
            where: { id: log.id },
            data: { status: "FAILED", errorMessage: "smtp not configured" },
        });
        return;
    }

    const language: Language =
        isSupportedLanguage(shop.settings.language) ?
            shop.settings.language
        :   "en";

    let identified: Identified;
    try {
        identified = await identifyOrder(
            shop.shopDomain,
            shop.accessToken,
            parsed,
            bodyText
        );
    } catch (err) {
        await db.emailLog.update({
            where: { id: log.id },
            data: {
                status: "FAILED",
                errorMessage: `lookup: ${(err as Error).message}`,
            },
        });
        return;
    }

    const { subject: replySubject, body } = buildReplyBody(
        language,
        identified.order,
        identified.multipleRecent
    );

    const greeting = shop.settings.greeting;
    const signature = shop.settings.signature;
    const preview = body.split("\n")[0] ?? "";

    try {
        const headers =
            inboundMessageId ?
                {
                    "In-Reply-To": inboundMessageId,
                    References: inboundMessageId,
                }
            :   undefined;
        await sendEmail(
            smtp,
            sender,
            replySubject,
            `${greeting}\n\n${body}\n\n${signature}`,
            createElement(WismoReply, { preview, greeting, body, signature }),
            headers
        );

        await db.emailLog.update({
            where: { id: log.id },
            data: {
                status: "REPLIED",
                orderId: identified.order?.id ?? null,
                orderName: identified.order?.name ?? null,
                repliedAt: new Date(),
            },
        });
    } catch (err) {
        await db.emailLog.update({
            where: { id: log.id },
            data: {
                status: "FAILED",
                errorMessage: `send: ${(err as Error).message}`,
                orderId: identified.order?.id ?? null,
                orderName: identified.order?.name ?? null,
            },
        });
    }
};
