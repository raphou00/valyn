import { NextResponse, type NextRequest } from "next/server";
import checkRateLimit from "@/lib/rate-limiter";
import { isValidShop } from "@/lib/shopify";

// Webhook-style endpoints (Shopify, SES/SNS) carry their own auth (HMAC /
// signature) and must bypass rate-limit + origin checks. OAuth endpoints
// also bypass since they're entered via Shopify admin redirect.
const isBypassPath = (pathname: string): boolean =>
    pathname.startsWith("/api/webhooks/") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/billing/");

// Shopify embedded apps must allow being framed by the merchant's admin and
// admin.shopify.com. CSP must reflect the requesting shop dynamically.
const setEmbeddedCsp = (res: NextResponse, shop: string | null) => {
    const ancestors =
        shop ?
            `https://${shop} https://admin.shopify.com`
        :   `https://*.myshopify.com https://admin.shopify.com`;
    res.headers.set("Content-Security-Policy", `frame-ancestors ${ancestors};`);
};

export const proxy = async (req: NextRequest) => {
    const { pathname, searchParams } = req.nextUrl;

    if (isBypassPath(pathname)) return;

    const identifier = req.headers.get("x-forwarded-for");
    if (!identifier) {
        return NextResponse.json({ message: "rate limited" }, { status: 429 });
    }

    const { allowed } = await checkRateLimit(identifier);
    if (!allowed) {
        return NextResponse.json({ message: "rate limited" }, { status: 429 });
    }

    const res = NextResponse.next();
    const shop = searchParams.get("shop");
    setEmbeddedCsp(res, isValidShop(shop) ? shop : null);
    return res;
};

export const config = {
    matcher: ["/((?!_next|_vercel|.*\\..*).*)"],
};
