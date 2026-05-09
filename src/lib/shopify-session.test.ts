import { describe, it, expect } from "vitest";
import { createHmac } from "node:crypto";
import { verifySessionToken, SessionTokenError } from "./shopify-session";

const SECRET = "test-api-secret-must-be-long";
const KEY = "test-api-key";
const SHOP = "test-shop.myshopify.com";

const b64url = (buf: Buffer | string): string =>
    Buffer.from(buf)
        .toString("base64")
        .replace(/=+$/, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");

const sign = (
    claims: Record<string, unknown>,
    secret: string = SECRET,
    alg: string = "HS256"
): string => {
    const header = b64url(JSON.stringify({ alg, typ: "JWT" }));
    const payload = b64url(JSON.stringify(claims));
    const sig = b64url(
        createHmac("sha256", secret).update(`${header}.${payload}`).digest()
    );
    return `${header}.${payload}.${sig}`;
};

const validClaims = (overrides: Record<string, unknown> = {}) => {
    const now = Math.floor(Date.now() / 1000);
    return {
        iss: `https://${SHOP}/admin`,
        dest: `https://${SHOP}`,
        aud: KEY,
        sub: "1",
        exp: now + 60,
        nbf: now - 5,
        iat: now,
        jti: "abc",
        ...overrides,
    };
};

describe("verifySessionToken", () => {
    it("accepts a valid token", () => {
        const claims = validClaims();
        const token = sign(claims);
        expect(verifySessionToken(token)).toMatchObject({
            aud: KEY,
            dest: claims.dest,
        });
    });

    it("rejects malformed tokens", () => {
        expect(() => verifySessionToken("not.a.token.too.many")).toThrow(
            SessionTokenError
        );
        expect(() => verifySessionToken("only-one-part")).toThrow(
            SessionTokenError
        );
    });

    it("rejects bad signature", () => {
        const token = sign(validClaims(), "wrong-secret");
        expect(() => verifySessionToken(token)).toThrow(/signature/);
    });

    it("rejects unsupported algorithm", () => {
        const token = sign(validClaims(), SECRET, "none");
        expect(() => verifySessionToken(token)).toThrow(/alg/);
    });

    it("rejects expired tokens", () => {
        const token = sign(
            validClaims({ exp: Math.floor(Date.now() / 1000) - 10 })
        );
        expect(() => verifySessionToken(token)).toThrow(/expired/);
    });

    it("rejects not-yet-valid tokens", () => {
        const token = sign(
            validClaims({ nbf: Math.floor(Date.now() / 1000) + 60 })
        );
        expect(() => verifySessionToken(token)).toThrow(/not yet valid/);
    });

    it("rejects wrong audience", () => {
        const token = sign(validClaims({ aud: "other-app" }));
        expect(() => verifySessionToken(token)).toThrow(/aud/);
    });

    it("rejects iss/dest host mismatch", () => {
        const token = sign(
            validClaims({ iss: "https://other.myshopify.com/admin" })
        );
        expect(() => verifySessionToken(token)).toThrow(/iss\/dest/);
    });

    it("rejects non-myshopify dest", () => {
        const token = sign(
            validClaims({
                iss: "https://attacker.com",
                dest: "https://attacker.com",
            })
        );
        expect(() => verifySessionToken(token)).toThrow(/shop/);
    });
});
