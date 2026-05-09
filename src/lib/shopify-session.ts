import { createHmac, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";
import db from "./db";
import env from "./env";
import { isValidShop } from "./shopify";

// Shopify session tokens (App Bridge `idToken()`) are HS256 JWTs signed with
// the app's API secret. Spec: https://shopify.dev/docs/apps/auth/session-tokens
type Claims = {
    iss: string;
    dest: string;
    aud: string;
    sub: string;
    exp: number;
    nbf: number;
    iat: number;
    jti: string;
    sid?: string;
};

const b64urlDecode = (s: string): Buffer =>
    Buffer.from(s.replace(/-/g, "+").replace(/_/g, "/"), "base64");

export class SessionTokenError extends Error {}

export const verifySessionToken = (token: string): Claims => {
    const parts = token.split(".");
    if (parts.length !== 3) throw new SessionTokenError("malformed token");

    const [h, p, s] = parts;
    const header = JSON.parse(b64urlDecode(h).toString("utf8"));
    if (header.alg !== "HS256") throw new SessionTokenError("bad alg");

    const expected = createHmac("sha256", env.SHOPIFY_API_SECRET)
        .update(`${h}.${p}`)
        .digest();
    const provided = b64urlDecode(s);
    if (
        expected.length !== provided.length ||
        !timingSafeEqual(expected, provided)
    ) {
        throw new SessionTokenError("bad signature");
    }

    const claims = JSON.parse(b64urlDecode(p).toString("utf8")) as Claims;

    const now = Math.floor(Date.now() / 1000);
    if (claims.exp <= now) throw new SessionTokenError("expired");
    if (claims.nbf > now) throw new SessionTokenError("not yet valid");
    if (claims.aud !== env.SHOPIFY_API_KEY)
        throw new SessionTokenError("bad aud");

    const issHost = new URL(claims.iss).host;
    const destHost = new URL(claims.dest).host;
    if (issHost !== destHost) throw new SessionTokenError("iss/dest mismatch");
    if (!isValidShop(destHost)) throw new SessionTokenError("bad shop");

    return claims;
};

export const getShopFromRequest = async (req: NextRequest) => {
    const auth = req.headers.get("authorization");
    if (!auth?.startsWith("Bearer ")) {
        throw new SessionTokenError("missing bearer");
    }
    const claims = verifySessionToken(auth.slice("Bearer ".length));
    const shopDomain = new URL(claims.dest).host;

    const shop = await db.shop.findUnique({
        where: { shopDomain },
        include: { settings: true },
    });
    if (!shop) throw new SessionTokenError("shop not installed");
    return shop;
};
