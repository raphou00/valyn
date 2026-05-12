import { WISMO_KEYWORDS, type Language } from "@/lib/translations";

const FLAT_KEYWORDS = Array.from(
    new Set(Object.values(WISMO_KEYWORDS).flat())
).map((k) => k.toLowerCase());

const LANG_KEYWORDS: { lang: Language; keywords: string[] }[] = (
    ["en", "fr", "de"] as const
).map((lang) => ({ lang, keywords: WISMO_KEYWORDS[lang] }));

export type DetectionResult = {
    intent: "WISMO" | "OTHER";
    confidence: number; // 0..1
    matched: string[]; // matched keywords
    language: Language | null;
    reason: string;
};

// Detect WISMO intent + which language pattern matched. Allowing the caller
// to restrict to a subset of languages (so Starter only matches EN).
export const detect = (
    subject: string,
    body: string,
    allowedLanguages: readonly Language[] = ["en", "fr", "de"]
): DetectionResult => {
    const text = `${subject}\n${body}`.toLowerCase();
    const matched: string[] = [];
    const langScores: Record<Language, number> = { en: 0, fr: 0, de: 0 };

    for (const { lang, keywords } of LANG_KEYWORDS) {
        if (!allowedLanguages.includes(lang)) continue;
        for (const k of keywords) {
            if (text.includes(k.toLowerCase())) {
                matched.push(k);
                langScores[lang] += 1;
            }
        }
    }

    // Pick the language with the most matches; tie-break by allowed-order.
    const bestLang =
        (Object.entries(langScores) as [Language, number][])
            .filter(([, score]) => score > 0)
            .sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

    if (matched.length === 0) {
        return {
            intent: "OTHER",
            confidence: 0,
            matched: [],
            language: null,
            reason: "no keywords matched",
        };
    }

    // Simple confidence: more unique matches = higher confidence, capped.
    const unique = new Set(matched).size;
    const confidence = Math.min(0.6 + unique * 0.1, 0.99);

    return {
        intent: "WISMO",
        confidence,
        matched: Array.from(new Set(matched)),
        language: bestLang,
        reason: `matched ${unique} keyword(s)`,
    };
};

// Legacy entry point. Returns just the intent string, keeps existing test
// suite working without changes.
export const detectIntent = (subject: string, body: string) =>
    detect(subject, body).intent;

// Find the first plausible order reference. Shopify order names are typically
// `#1234` (often ≥4 digits). We accept #1234 or "order 1234".
export const extractOrderName = (
    subject: string,
    body: string
): string | null => {
    const text = `${subject}\n${body}`;
    const hashMatch = text.match(/#(\d{3,})/);
    if (hashMatch) return `#${hashMatch[1]}`;
    const wordMatch = text.match(/\border\s*#?(\d{3,})/i);
    if (wordMatch) return `#${wordMatch[1]}`;
    const cmdMatch = text.match(/\bcommande\s*#?(\d{3,})/i);
    if (cmdMatch) return `#${cmdMatch[1]}`;
    return null;
};

export const isSupportedLanguage = (
    s: string | null | undefined
): s is Language => s === "en" || s === "fr" || s === "de";

// Retained for callers that imported it pre-refactor.
export { FLAT_KEYWORDS };
