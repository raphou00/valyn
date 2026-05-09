import {
    createCipheriv,
    createDecipheriv,
    randomBytes,
    type CipherGCM,
    type DecipherGCM,
} from "node:crypto";
import env from "./env";

// AES-256-GCM. Format: base64( iv(12) || authTag(16) || ciphertext ).
const ALG = "aes-256-gcm";
const IV_LEN = 12;

const key = (): Buffer => {
    const raw = Buffer.from(env.SMTP_CREDS_KEY, "base64");
    if (raw.length !== 32) {
        throw new Error("SMTP_CREDS_KEY must decode to 32 bytes (base64)");
    }
    return raw;
};

export const encrypt = (plaintext: string): string => {
    const iv = randomBytes(IV_LEN);
    const cipher = createCipheriv(ALG, key(), iv) as CipherGCM;
    const enc = Buffer.concat([
        cipher.update(plaintext, "utf8"),
        cipher.final(),
    ]);
    const tag = cipher.getAuthTag();
    return Buffer.concat([iv, tag, enc]).toString("base64");
};

export const decrypt = (payload: string): string => {
    const buf = Buffer.from(payload, "base64");
    const iv = buf.subarray(0, IV_LEN);
    const tag = buf.subarray(IV_LEN, IV_LEN + 16);
    const enc = buf.subarray(IV_LEN + 16);
    const decipher = createDecipheriv(ALG, key(), iv) as DecipherGCM;
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(enc), decipher.final()]).toString(
        "utf8"
    );
};
