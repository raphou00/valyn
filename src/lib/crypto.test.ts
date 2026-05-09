import { describe, it, expect } from "vitest";
import { encrypt, decrypt } from "./crypto";

describe("crypto", () => {
    it("round-trips ascii", () => {
        const plain = "hunter2";
        expect(decrypt(encrypt(plain))).toBe(plain);
    });

    it("round-trips unicode + long strings", () => {
        const plain = "Mot de passe très sécurisé 🔐 ".repeat(20);
        expect(decrypt(encrypt(plain))).toBe(plain);
    });

    it("produces different ciphertext for the same plaintext (random IV)", () => {
        expect(encrypt("same")).not.toBe(encrypt("same"));
    });

    it("rejects tampered ciphertext (auth tag mismatch)", () => {
        const enc = encrypt("legit");
        const buf = Buffer.from(enc, "base64");
        // Flip a byte in the ciphertext region (after iv:12 + tag:16).
        buf[30] ^= 0xff;
        const tampered = buf.toString("base64");
        expect(() => decrypt(tampered)).toThrow();
    });

    it("rejects tampered auth tag", () => {
        const enc = encrypt("legit");
        const buf = Buffer.from(enc, "base64");
        buf[12] ^= 0xff; // tag starts at offset 12
        expect(() => decrypt(buf.toString("base64"))).toThrow();
    });
});
