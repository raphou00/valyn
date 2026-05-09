import { NextResponse, type NextRequest } from "next/server";
import { randomBytes } from "node:crypto";
import env from "@/lib/env";
import { isValidShop } from "@/lib/shopify";

export async function GET(req: NextRequest) {
    const shop = req.nextUrl.searchParams.get("shop");

    if (!isValidShop(shop)) {
        return NextResponse.json(
            { message: "invalid shop" },
            { status: 400 }
        );
    }

    const state = randomBytes(16).toString("hex");

    const authUrl = new URL(`https://${shop}/admin/oauth/authorize`);
    authUrl.searchParams.set("client_id", env.SHOPIFY_API_KEY);
    authUrl.searchParams.set("scope", env.SHOPIFY_SCOPES);
    authUrl.searchParams.set(
        "redirect_uri",
        `${env.SHOPIFY_APP_URL}/api/auth/callback`
    );
    authUrl.searchParams.set("state", state);
    authUrl.searchParams.set("grant_options[]", "");

    const res = NextResponse.redirect(authUrl);
    res.cookies.set("shopify_oauth_state", state, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 600,
    });
    return res;
}
