import { NextResponse, type NextRequest } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";
import db from "@/lib/db";
import env from "@/lib/env";
import logger from "@/lib/logger";

const verifyWebhookHmac = (raw: string, header: string | null): boolean => {
    if (!header) return false;
    const computed = createHmac("sha256", env.SHOPIFY_API_SECRET)
        .update(raw, "utf8")
        .digest("base64");
    const a = Buffer.from(computed, "utf8");
    const b = Buffer.from(header, "utf8");
    return a.length === b.length && timingSafeEqual(a, b);
};

export async function POST(req: NextRequest) {
    const raw = await req.text();
    const hmac = req.headers.get("x-shopify-hmac-sha256");
    const topic = req.headers.get("x-shopify-topic");
    const shopDomain = req.headers.get("x-shopify-shop-domain");

    if (!verifyWebhookHmac(raw, hmac)) {
        return NextResponse.json({ message: "bad hmac" }, { status: 401 });
    }
    if (!topic || !shopDomain) {
        return NextResponse.json(
            { message: "missing headers" },
            { status: 400 }
        );
    }

    switch (topic) {
        case "app/uninstalled":
            await db.shop.updateMany({
                where: { shopDomain },
                data: {
                    uninstalledAt: new Date(),
                    subscriptionStatus: "CANCELLED",
                },
            });
            break;

        case "app_subscriptions/update": {
            const payload = JSON.parse(raw) as {
                app_subscription?: {
                    admin_graphql_api_id?: string;
                    status?: string;
                    current_period_end?: string | null;
                };
            };
            const sub = payload.app_subscription;
            if (sub?.admin_graphql_api_id && sub.status) {
                await db.shop.updateMany({
                    where: {
                        shopDomain,
                        subscriptionId: sub.admin_graphql_api_id,
                    },
                    data: {
                        subscriptionStatus: sub.status as
                            | "PENDING"
                            | "ACTIVE"
                            | "CANCELLED"
                            | "DECLINED"
                            | "EXPIRED"
                            | "FROZEN",
                        currentPeriodEnd:
                            sub.current_period_end ?
                                new Date(sub.current_period_end)
                            :   null,
                    },
                });
            }
            break;
        }

        // GDPR mandatory webhooks. PII held by Valyn = EmailLog rows
        // (senderEmail, subject, body) and Settings.smtpUser/smtpPassEnc.
        case "customers/data_request": {
            // Data request: assemble what we hold for this customer and log
            // it. Spec doesn't mandate transport — operational follow-up is
            // expected via support@.
            const payload = JSON.parse(raw) as {
                customer?: { email?: string };
            };
            const email = payload.customer?.email?.toLowerCase();
            if (email) {
                const shop = await db.shop.findUnique({
                    where: { shopDomain },
                });
                if (shop) {
                    const rows = await db.emailLog.findMany({
                        where: { shopId: shop.id, senderEmail: email },
                        select: {
                            id: true,
                            subject: true,
                            body: true,
                            intent: true,
                            status: true,
                            receivedAt: true,
                            repliedAt: true,
                        },
                    });
                    logger.info("gdpr data_request", {
                        shopDomain,
                        email,
                        records: rows.length,
                    });
                }
            }
            break;
        }

        case "customers/redact": {
            const payload = JSON.parse(raw) as {
                customer?: { email?: string };
            };
            const email = payload.customer?.email?.toLowerCase();
            if (email) {
                const shop = await db.shop.findUnique({
                    where: { shopDomain },
                });
                if (shop) {
                    const { count } = await db.emailLog.deleteMany({
                        where: { shopId: shop.id, senderEmail: email },
                    });
                    logger.info("gdpr customers/redact", {
                        shopDomain,
                        email,
                        deleted: count,
                    });
                }
            }
            break;
        }

        case "shop/redact": {
            // Triggered 48h after uninstall. Drop everything for the shop;
            // cascade removes Settings + EmailLog.
            const { count } = await db.shop.deleteMany({
                where: { shopDomain },
            });
            logger.info("gdpr shop/redact", { shopDomain, deleted: count });
            break;
        }

        default:
            // Unknown topic — ack to avoid retries.
            break;
    }

    return NextResponse.json({ ok: true });
}
