import {
    BedrockRuntimeClient,
    ConverseCommand,
} from "@aws-sdk/client-bedrock-runtime";
import env from "@/lib/env";
import logger from "@/lib/logger";
import type { Language } from "@/lib/translations";

// LLM intent classification for WISMO. Used only for emails the cheap keyword
// pre-filter couldn't decide confidently — keeps Bedrock spend tiny. Any
// failure returns null so the caller falls back to the keyword classifier;
// the LLM is never a hard dependency.

export type LlmClassification = {
    isWismo: boolean;
    confidence: number; // 0..1
    language: Language | null;
    orderNumber: string | null;
    reason: string;
};

const MAX_BODY_CHARS = 1500;
const TIMEOUT_MS = 8000;

const client = new BedrockRuntimeClient({
    region: env.BEDROCK_REGION,
    credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    },
});

const SYSTEM = `You classify inbound e-commerce support emails.

WISMO ("where is my order") = a customer asking about the status, shipping, \
tracking, or delivery of an order they already placed.

NOT WISMO = marketing/newsletters, order confirmations, returns/refunds, \
product questions, complaints, vendor/supplier mail, anything automated.

Reply with ONLY a JSON object, no prose:
{"isWismo":bool,"confidence":0..1,"language":"en"|"fr"|"de"|null,\
"orderNumber":string|null,"reason":"short"}

language = the customer's language. orderNumber = order reference if present \
(e.g. "#1001"), else null. Be strict: a single shipping-related word in a \
marketing email is NOT WISMO.`;

const parse = (raw: string): LlmClassification | null => {
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");
    if (start === -1 || end === -1 || end < start) return null;
    let obj: unknown;
    try {
        obj = JSON.parse(raw.slice(start, end + 1));
    } catch {
        return null;
    }
    if (typeof obj !== "object" || obj === null) return null;
    const o = obj as Record<string, unknown>;
    if (typeof o.isWismo !== "boolean") return null;

    const lang =
        o.language === "en" || o.language === "fr" || o.language === "de" ?
            o.language
        :   null;
    const confidence =
        typeof o.confidence === "number" ?
            Math.max(0, Math.min(1, o.confidence))
        :   0.5;
    return {
        isWismo: o.isWismo,
        confidence,
        language: lang,
        orderNumber:
            typeof o.orderNumber === "string" && o.orderNumber ?
                o.orderNumber
            :   null,
        reason: typeof o.reason === "string" ? o.reason.slice(0, 200) : "llm",
    };
};

export const classifyWithLlm = async (
    subject: string,
    body: string
): Promise<LlmClassification | null> => {
    if (env.WISMO_LLM_ENABLED !== "true") return null;

    const text = `Subject: ${subject}\n\nBody:\n${body.slice(0, MAX_BODY_CHARS)}`;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);

    try {
        const res = await client.send(
            new ConverseCommand({
                modelId: env.BEDROCK_MODEL_ID,
                system: [{ text: SYSTEM }],
                messages: [{ role: "user", content: [{ text }] }],
                inferenceConfig: { maxTokens: 200, temperature: 0 },
            }),
            { abortSignal: ctrl.signal }
        );
        const out = res.output?.message?.content?.[0]?.text;
        if (!out) return null;
        return parse(out);
    } catch (err) {
        // Down / throttled / model-access not enabled / timed out — caller
        // falls back to the keyword classifier.
        logger.warn("wismo llm classify failed", {
            error: (err as Error).message,
        });
        return null;
    } finally {
        clearTimeout(timer);
    }
};
