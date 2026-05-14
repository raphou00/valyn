import { createElement } from "react";
import type { ParsedMail } from "mailparser";
import db from "@/lib/db";
import { decrypt } from "@/lib/crypto";
import sendEmail, { type ShopSmtpConfig } from "@/lib/email";
import { t, type Language } from "@/lib/translations";
import WismoReply from "@/components/emails/wismo-reply";
import { isSubscriptionActive } from "@/lib/billing";
import logger from "@/lib/logger";
import { capabilitiesFor } from "@/lib/plan-features";
import { getUsage } from "@/lib/usage";
import { humanizeSmtpError } from "@/lib/smtp-errors";
import { detect, extractOrderName, isSupportedLanguage } from "./detect";
import {
    findMostRecentOrder,
    findOrderByName,
    findRecentOrdersByEmail,
    type WismoOrder,
} from "./shopify-orders";
import { applyTone } from "./tone";

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

export type WismoTemplateType =
    | "IN_TRANSIT"
    | "PROCESSING"
    | "NO_ORDER"
    | "MULTIPLE";

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

const chooseTemplateType = (
    order: WismoOrder | null,
    multipleRecent: boolean
): WismoTemplateType => {
    if (!order) return "NO_ORDER";
    if (multipleRecent) return "MULTIPLE";
    const status = order.fulfillmentStatus?.toUpperCase() ?? "";
    if (status === "FULFILLED" || order.tracking?.number || order.tracking?.url)
        return "IN_TRANSIT";
    return "PROCESSING";
};

type TemplateRow = {
    type: WismoTemplateType;
    body: string;
    isDefault: boolean;
};

const interpolate = (
    template: string,
    vars: Record<string, string | undefined>
): string =>
    template.replace(
        /\{\{\s*([a-zA-Z_]+)\s*\}\}/g,
        (_, k: string) => vars[k] ?? ""
    );

const buildReplyBody = (
    language: Language,
    order: WismoOrder | null,
    multipleRecent: boolean,
    template: TemplateRow | null
): { subject: string; body: string; type: WismoTemplateType } => {
    const tr = t(language);
    const type = chooseTemplateType(order, multipleRecent);

    const vars: Record<string, string | undefined> = {
        orderName: order?.name,
        carrier: order?.tracking?.company ?? undefined,
        tracking: order?.tracking?.url ?? order?.tracking?.number ?? undefined,
        eta: undefined,
    };

    // Merchant-defined template wins. Fallback to the built-in language pack.
    if (template) {
        return {
            subject: order ? `Re: ${order.name}` : "Order tracking",
            body: interpolate(template.body, vars),
            type,
        };
    }

    if (type === "NO_ORDER") {
        return { subject: "Order tracking", body: tr.noOrderFound, type };
    }
    if (type === "PROCESSING") {
        return {
            subject: `Re: ${order!.name}`,
            body: tr.processing({ orderName: order!.name }),
            type,
        };
    }
    const inTransit = tr.inTransit({
        orderName: order!.name,
        carrier: vars.carrier,
        tracking: vars.tracking,
    });
    const notice =
        multipleRecent ?
            `\n\n${tr.multipleOrdersNotice({ orderName: order!.name })}`
        :   "";
    return { subject: `Re: ${order!.name}`, body: inTransit + notice, type };
};

const findTemplate = async (
    shopId: string,
    type: WismoTemplateType
): Promise<TemplateRow | null> => {
    const tpl = await db.replyTemplate.findFirst({
        where: { shopId, type, isDefault: true },
        select: { type: true, body: true, isDefault: true },
    });
    return tpl as TemplateRow | null;
};

const updateLog = (id: string, data: Record<string, unknown>) =>
    db.emailLog.update({ where: { id }, data });

export type SendOutcome =
    | { status: "REPLIED" }
    | { status: "FAILED"; error: string };

// Send the reply for an existing EmailLog row. Used both at intake time and
// for manual retries / review-queue approvals.
export const sendReplyForLog = async (logId: string): Promise<SendOutcome> => {
    const log = await db.emailLog.findUnique({
        where: { id: logId },
        include: { shop: { include: { settings: true } } },
    });
    if (!log) return { status: "FAILED", error: "log not found" };
    const { shop } = log;
    if (!shop.settings) return { status: "FAILED", error: "no settings" };
    if (shop.uninstalledAt) return { status: "FAILED", error: "uninstalled" };
    if (!isSubscriptionActive(shop.subscriptionStatus))
        return { status: "FAILED", error: "no active subscription" };

    const smtp = buildSmtpConfig(shop.settings);
    if (!smtp) return { status: "FAILED", error: "smtp not configured" };

    const language: Language =
        isSupportedLanguage(log.detectedLanguage) ? log.detectedLanguage
        : isSupportedLanguage(shop.settings.language) ? shop.settings.language
        : "en";

    // Re-identify the order in case state changed since first attempt.
    const subject = log.subject ?? "";
    const bodyText = log.body ?? "";
    let identified: Identified;
    try {
        identified = await identifyOrder(
            shop.shopDomain,
            shop.accessToken,
            {
                subject,
                text: bodyText,
                from: {
                    value: [{ address: log.senderEmail }],
                    html: "",
                    text: "",
                },
            } as unknown as ParsedMail,
            bodyText
        );
    } catch (err) {
        return { status: "FAILED", error: `lookup: ${(err as Error).message}` };
    }

    const type = chooseTemplateType(
        identified.order,
        identified.multipleRecent
    );
    const caps = capabilitiesFor(shop.planKey);
    const template =
        caps.multipleTemplates ? await findTemplate(shop.id, type) : null;

    const { subject: replySubject, body } = buildReplyBody(
        language,
        identified.order,
        identified.multipleRecent,
        template
    );

    const tone = (caps.toneControl ? shop.settings.tone : "NEUTRAL") as
        | "NEUTRAL"
        | "FRIENDLY"
        | "FORMAL";
    const toneBody = applyTone(tone, language, body);

    const greeting = shop.settings.greeting;
    const signature = shop.settings.signature;
    const fullText = `${greeting}\n\n${toneBody}\n\n${signature}`;
    const preview = body.split("\n")[0] ?? "";

    try {
        const headers =
            log.inboundMessageId ?
                {
                    "In-Reply-To": log.inboundMessageId,
                    References: log.inboundMessageId,
                }
            :   undefined;
        await sendEmail(
            smtp,
            log.senderEmail,
            replySubject,
            fullText,
            createElement(WismoReply, {
                preview,
                greeting,
                body: toneBody,
                signature,
            }),
            headers
        );
        await updateLog(log.id, {
            status: "REPLIED",
            orderId: identified.order?.id ?? null,
            orderName: identified.order?.name ?? null,
            replyPreview: fullText,
            repliedAt: new Date(),
            errorMessage: null,
        });
        return { status: "REPLIED" };
    } catch (err) {
        const raw = (err as Error).message;
        await updateLog(log.id, {
            status: "FAILED",
            errorMessage: humanizeSmtpError(raw),
            orderId: identified.order?.id ?? null,
            orderName: identified.order?.name ?? null,
        });
        return { status: "FAILED", error: raw };
    }
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

    const caps = capabilitiesFor(shop.planKey);
    const detection = detect(subject, bodyText, caps.languages);

    const log = await db.emailLog.create({
        data: {
            shopId: shop.id,
            inboundMessageId,
            senderEmail: sender,
            subject,
            body: bodyText,
            intent: detection.intent,
            confidence: detection.confidence,
            detectionReason: detection.reason,
            detectedLanguage: detection.language ?? null,
            status: "PENDING",
            receivedAt: parsed.date ?? new Date(),
        },
    });

    // Non-WISMO: log and stop. Pause / strictness rules still apply for
    // WISMO-positive emails below.
    if (detection.intent === "OTHER") {
        await updateLog(log.id, {
            status: "IGNORED",
            errorMessage: "non-WISMO",
        });
        return;
    }

    if (!isSubscriptionActive(shop.subscriptionStatus)) {
        await updateLog(log.id, {
            status: "IGNORED",
            errorMessage: "no active subscription",
        });
        return;
    }

    // Pause: still log everything (per marketing claim "paused emails should
    // be logged and reviewable, not silently ignored"), park in REVIEW so the
    // merchant can act on them later.
    if (!shop.settings.autoReplyEnabled) {
        await updateLog(log.id, {
            status: "REVIEW",
            errorMessage: "automation paused",
        });
        return;
    }

    // Quota: count emails in the current period (including this row we just
    // wrote). If we're over, mark and stop.
    const usage = await getUsage({
        id: shop.id,
        planKey: shop.planKey,
        currentPeriodEnd: shop.currentPeriodEnd,
    });
    if (usage.used > usage.quota) {
        await updateLog(log.id, {
            status: "LIMIT_EXCEEDED",
            errorMessage: `quota ${usage.used}/${usage.quota} for this billing period`,
        });
        return;
    }

    // Strictness: PASS_THROUGH never replies; REVIEW_QUEUE parks for manual
    // approval; AUTO_REPLY proceeds.
    if (shop.settings.strictness === "PASS_THROUGH") {
        await updateLog(log.id, {
            status: "IGNORED",
            errorMessage: "strictness: pass-through",
        });
        return;
    }
    if (shop.settings.strictness === "REVIEW_QUEUE") {
        await updateLog(log.id, { status: "REVIEW" });
        return;
    }

    const smtp = buildSmtpConfig(shop.settings);
    if (!smtp) {
        await updateLog(log.id, {
            status: "FAILED",
            errorMessage: humanizeSmtpError("smtp not configured"),
        });
        return;
    }

    let identified: Identified;
    try {
        identified = await identifyOrder(
            shop.shopDomain,
            shop.accessToken,
            parsed,
            bodyText
        );
    } catch (err) {
        await updateLog(log.id, {
            status: "FAILED",
            errorMessage: `lookup: ${(err as Error).message}`,
        });
        return;
    }

    // Fallback behavior when no order matched.
    if (!identified.order) {
        if (shop.settings.fallbackBehavior === "SKIP") {
            await updateLog(log.id, {
                status: "IGNORED",
                errorMessage: "fallback: skip (no order match)",
            });
            return;
        }
        if (shop.settings.fallbackBehavior === "QUEUE_REVIEW") {
            await updateLog(log.id, {
                status: "REVIEW",
                errorMessage: "fallback: queue (no order match)",
            });
            return;
        }
        // SEND_FALLBACK falls through to the regular reply path.
    }

    const language: Language =
        detection.language ??
        (isSupportedLanguage(shop.settings.language) ?
            shop.settings.language
        :   "en");

    const type = chooseTemplateType(
        identified.order,
        identified.multipleRecent
    );
    const template =
        caps.multipleTemplates ? await findTemplate(shop.id, type) : null;
    const { subject: replySubject, body } = buildReplyBody(
        language,
        identified.order,
        identified.multipleRecent,
        template
    );

    const tone = (caps.toneControl ? shop.settings.tone : "NEUTRAL") as
        | "NEUTRAL"
        | "FRIENDLY"
        | "FORMAL";
    const toneBody = applyTone(tone, language, body);

    const greeting = shop.settings.greeting;
    const signature = shop.settings.signature;
    const fullText = `${greeting}\n\n${toneBody}\n\n${signature}`;
    const preview = body.split("\n")[0] ?? "";

    // Response delay: honor up to 60s in-process (any longer would risk SNS
    // delivery timeouts and Vercel function limits). Document this constraint
    // so merchants don't expect 10-minute delays today.
    const delayMs =
        Math.max(0, Math.min(60, shop.settings.responseDelaySeconds)) * 1000;
    if (delayMs > 0) await new Promise((r) => setTimeout(r, delayMs));

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
            fullText,
            createElement(WismoReply, {
                preview,
                greeting,
                body: toneBody,
                signature,
            }),
            headers
        );
        await updateLog(log.id, {
            status: "REPLIED",
            orderId: identified.order?.id ?? null,
            orderName: identified.order?.name ?? null,
            replyPreview: fullText,
            repliedAt: new Date(),
        });
    } catch (err) {
        await updateLog(log.id, {
            status: "FAILED",
            errorMessage: humanizeSmtpError((err as Error).message),
            orderId: identified.order?.id ?? null,
            orderName: identified.order?.name ?? null,
        });
    }
};

export type ReplyPreview = {
    subject: string;
    body: string;
    orderName: string | null;
    carrier: string | null;
    tracking: string | null;
    language: Language;
    type: WismoTemplateType;
};

// Composes the reply Valyn would send for a synthetic "where is my order?"
// against the merchant's most recent order. Read-only — does not send mail
// or write EmailLog. Used by the dashboard's "Send a test email" feature.
export const previewReply = async (
    shopId: string
): Promise<ReplyPreview | { error: string }> => {
    const shop = await db.shop.findUnique({
        where: { id: shopId },
        include: { settings: true },
    });
    if (!shop || !shop.settings) return { error: "no settings" };

    const order = await findMostRecentOrder(shop.shopDomain, shop.accessToken);
    const language: Language =
        isSupportedLanguage(shop.settings.language) ? shop.settings.language
        :   "en";

    const caps = capabilitiesFor(shop.planKey);
    const type = chooseTemplateType(order, false);
    const template =
        caps.multipleTemplates ? await findTemplate(shop.id, type) : null;
    const { subject, body } = buildReplyBody(language, order, false, template);

    const tone = (caps.toneControl ? shop.settings.tone : "NEUTRAL") as
        | "NEUTRAL"
        | "FRIENDLY"
        | "FORMAL";
    const toneBody = applyTone(tone, language, body);

    const greeting = shop.settings.greeting;
    const signature = shop.settings.signature;
    const fullText = `${greeting}\n\n${toneBody}\n\n${signature}`;

    return {
        subject,
        body: fullText,
        orderName: order?.name ?? null,
        carrier: order?.tracking?.company ?? null,
        tracking: order?.tracking?.url ?? order?.tracking?.number ?? null,
        language,
        type,
    };
};
