import { NextResponse, type NextRequest } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";
import db from "@/lib/db";
import env from "@/lib/env";
import logger from "@/lib/logger";
import { isValidShop } from "@/lib/shopify-domain";

const verifyOAuthHmac = (params: URLSearchParams): boolean => {
    const provided = params.get("hmac");
    if (!provided) return false;

    const sorted = [...params.entries()]
        .filter(([k]) => k !== "hmac" && k !== "signature")
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
        .join("&");

    const computed = createHmac("sha256", env.SHOPIFY_API_SECRET)
        .update(sorted)
        .digest("hex");

    const a = Buffer.from(computed, "utf8");
    const b = Buffer.from(provided, "utf8");
    return a.length === b.length && timingSafeEqual(a, b);
};

// app/uninstalled and app_subscriptions/update are app-level webhooks we
// register at install. The GDPR mandatory webhooks (customers/data_request,
// customers/redact, shop/redact) are configured ONCE in the Partners
// dashboard and fired by Shopify across all shops — don't re-register here.
const APP_WEBHOOKS = ["app/uninstalled", "app_subscriptions/update"];

const registerWebhook = async (
    shop: string,
    accessToken: string,
    topic: string
) => {
    const callbackUrl = `${env.SHOPIFY_APP_URL}/api/webhooks/shopify`;
    try {
        const res = await fetch(
            `https://${shop}/admin/api/2024-10/webhooks.json`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Shopify-Access-Token": accessToken,
                },
                body: JSON.stringify({
                    webhook: { topic, address: callbackUrl, format: "json" },
                }),
            }
        );
        // Re-installs return 422 "Address for this topic has already been
        // taken" — that's success in our world. Log other failures and move
        // on; the app should not block install on registration glitches.
        if (!res.ok && res.status !== 422) {
            logger.warn("webhook registration failed", {
                shop,
                topic,
                status: res.status,
            });
        }
    } catch (err) {
        logger.warn("webhook registration threw", {
            shop,
            topic,
            error: (err as Error).message,
        });
    }
};

const registerWebhooks = (shop: string, accessToken: string) =>
    Promise.all(APP_WEBHOOKS.map((t) => registerWebhook(shop, accessToken, t)));

export async function GET(req: NextRequest) {
    const params = req.nextUrl.searchParams;
    const shop = params.get("shop");
    const code = params.get("code");
    const state = params.get("state");
    const cookieState = req.cookies.get("shopify_oauth_state")?.value;

    if (!isValidShop(shop) || !code || !state) {
        return NextResponse.json(
            { message: "invalid request" },
            { status: 400 }
        );
    }
    if (!cookieState || cookieState !== state) {
        return NextResponse.json(
            { message: "state mismatch" },
            { status: 403 }
        );
    }
    if (!verifyOAuthHmac(params)) {
        return NextResponse.json({ message: "bad hmac" }, { status: 403 });
    }

    const tokenRes = await fetch(`https://${shop}/admin/oauth/access_token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            client_id: env.SHOPIFY_API_KEY,
            client_secret: env.SHOPIFY_API_SECRET,
            code,
        }),
    });

    if (!tokenRes.ok) {
        return NextResponse.json(
            { message: "token exchange failed" },
            { status: 502 }
        );
    }

    const { access_token, scope } = (await tokenRes.json()) as {
        access_token: string;
        scope: string;
    };

    const shopRow = await db.shop.upsert({
        where: { shopDomain: shop },
        create: {
            shopDomain: shop,
            accessToken: access_token,
            scopes: scope,
            settings: { create: {} },
        },
        update: {
            accessToken: access_token,
            scopes: scope,
            uninstalledAt: null,
        },
    });

    // Per-shop inbound address. Use upsert in case the Shop existed without
    // Settings (rare, but possible after schema migrations).
    const inboundAddress = `wismo+${shopRow.id}@${env.INBOUND_EMAIL_DOMAIN}`;
    await db.settings.upsert({
        where: { shopId: shopRow.id },
        create: { shopId: shopRow.id, inboundAddress },
        update: { inboundAddress },
    });

    await registerWebhooks(shop, access_token);

    const host = params.get("host");
    const target =
        host ?
            `https://${shop}/admin/apps/${env.SHOPIFY_API_KEY}?host=${host}`
        :   `https://${shop}/admin/apps/${env.SHOPIFY_API_KEY}`;

    const res = NextResponse.redirect(target);
    res.cookies.delete("shopify_oauth_state");
    return res;
}
