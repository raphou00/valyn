import type { Language } from "@/lib/translations";

export type Tone = "NEUTRAL" | "FRIENDLY" | "FORMAL";

type ToneStrings = {
    openings: Record<Language, string[]>;
    closings: Record<Language, string[]>;
};

// Tone affects opener + closer added around the body. Greeting/signature
// stay merchant-controlled — we only insert a soft tone phrase between them
// and the body. This is conservative on purpose: tone shouldn't change
// factual content, only feel.
const TONE_TEXT: Record<Tone, ToneStrings> = {
    NEUTRAL: {
        openings: {
            en: ["Here's an update on your order:"],
            fr: ["Voici une mise à jour concernant votre commande :"],
            de: ["Hier ist ein Update zu Ihrer Bestellung:"],
        },
        closings: {
            en: ["Let us know if you have other questions."],
            fr: ["N'hésitez pas si vous avez d'autres questions."],
            de: ["Bei weiteren Fragen melden Sie sich gerne."],
        },
    },
    FRIENDLY: {
        openings: {
            en: ["Thanks for getting in touch — quick update for you:"],
            fr: ["Merci pour votre message — voici une petite mise à jour :"],
            de: ["Danke für deine Nachricht — kurzes Update für dich:"],
        },
        closings: {
            en: ["Hope that helps — happy shopping!"],
            fr: ["En espérant que cela vous aide — bonne réception !"],
            de: ["Ich hoffe, das hilft — viel Spaß beim Auspacken!"],
        },
    },
    FORMAL: {
        openings: {
            en: ["We are writing to provide an update regarding your order:"],
            fr: ["Nous vous écrivons pour vous informer de l'état de votre commande :"],
            de: ["Wir möchten Ihnen ein Update zu Ihrer Bestellung mitteilen:"],
        },
        closings: {
            en: ["Please reply to this message should you require further assistance."],
            fr: ["N'hésitez pas à nous répondre si vous avez besoin d'une assistance supplémentaire."],
            de: ["Bei weiteren Fragen antworten Sie bitte direkt auf diese Nachricht."],
        },
    },
};

export const applyTone = (
    tone: Tone,
    language: Language,
    body: string
): string => {
    const t = TONE_TEXT[tone];
    const opening = t.openings[language][0];
    const closing = t.closings[language][0];
    return `${opening}\n\n${body}\n\n${closing}`;
};
