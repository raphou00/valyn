import { NextResponse, type NextRequest } from "next/server";
import checkRateLimit from "@/lib/rate-limiter";
import { isValidShop } from "@/lib/shopify-domain";

// Webhook-style endpoints (Shopify, SES/SNS) carry their own auth (HMAC /
// signature) and must bypass everything. OAuth + Shopify billing redirects
// also bypass since they're entered via Shopify admin redirect.
const isBypassPath = (pathname: string): boolean =>
    pathname.startsWith("/api/webhooks/") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/billing/") ||
    pathname.startsWith("/api/cron/");

// Embedded admin = the part of the app that loads inside Shopify admin's
// iframe. Needs frame-ancestors CSP. Public marketing site doesn't.
const isEmbeddedPath = (pathname: string): boolean =>
    pathname === "/dashboard" ||
    pathname.startsWith("/dashboard/") ||
    pathname === "/settings" ||
    pathname.startsWith("/settings/") ||
    pathname === "/templates" ||
    pathname.startsWith("/templates/");

const setEmbeddedCsp = (res: NextResponse, shop: string | null) => {
    const ancestors =
        shop ?
            `https://${shop} https://admin.shopify.com`
        :   `https://*.myshopify.com https://admin.shopify.com`;
    res.headers.set("Content-Security-Policy", `frame-ancestors ${ancestors};`);
};

export const proxy = async (req: NextRequest) => {
    const { pathname, searchParams } = req.nextUrl;
    const shop = searchParams.get("shop");

    if (isBypassPath(pathname)) return;

    // Shopify admin lands the merchant on `/?shop=&host=&embedded=1` after
    // install. Bounce them into the embedded dashboard.
    if (pathname === "/" && isValidShop(shop)) {
        const url = req.nextUrl.clone();
        url.pathname = "/dashboard";
        const res = NextResponse.redirect(url);
        setEmbeddedCsp(res, shop);
        return res;
    }

    // Rate-limit the dashboard's session-token-authed APIs only. Public
    // marketing pages and OAuth flows are unbounded (they cap themselves on
    // the network layer / Vercel).
    if (pathname.startsWith("/api/internal/")) {
        const identifier = req.headers.get("x-forwarded-for") ?? "unknown";
        const { allowed } = await checkRateLimit(identifier);
        if (!allowed) {
            return NextResponse.json(
                { message: "rate limited" },
                { status: 429 }
            );
        }
    }

    const res = NextResponse.next();
    if (isEmbeddedPath(pathname)) {
        setEmbeddedCsp(res, isValidShop(shop) ? shop : null);
    }
    return res;
};

export const config = {
    matcher: ["/((?!_next|_vercel|.*\\..*).*)"],
};
