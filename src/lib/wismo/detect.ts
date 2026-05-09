import { WISMO_KEYWORDS, type Language } from "@/lib/translations";

const ALL_KEYWORDS = Array.from(
    new Set(Object.values(WISMO_KEYWORDS).flat())
).map((k) => k.toLowerCase());

// WISMO classification per spec §3. Pure keyword match against subject+body.
// Cross-language: we always check every locale's keywords, since merchants
// often receive emails outside their configured Settings.language.
export const detectIntent = (
    subject: string,
    body: string
): "WISMO" | "OTHER" => {
    const text = `${subject}\n${body}`.toLowerCase();
    for (const k of ALL_KEYWORDS) {
        if (text.includes(k)) return "WISMO";
    }
    return "OTHER";
};

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

export const isSupportedLanguage = (s: string | null | undefined): s is Language =>
    s === "en" || s === "fr" || s === "de";
