// Reply template strings, keyed by Settings.language (EN / FR / DE per spec).
// Plain object map — no routing, no library. Use t(language).key.

export type Language = "en" | "fr" | "de";

export const SUPPORTED_LANGUAGES: Language[] = ["en", "fr", "de"];

type ReplyStrings = {
    subjectPrefix: string;
    inTransit: (args: {
        orderName: string;
        carrier?: string;
        tracking?: string;
        eta?: string;
    }) => string;
    processing: (args: { orderName: string }) => string;
    noOrderFound: string;
    multipleOrdersNotice: (args: { orderName: string }) => string;
};

const en: ReplyStrings = {
    subjectPrefix: "Re:",
    inTransit: ({ orderName, carrier, tracking, eta }) =>
        [
            `Your order ${orderName} is currently in transit.`,
            carrier ? `Carrier: ${carrier}` : null,
            tracking ? `Tracking: ${tracking}` : null,
            eta ? `Expected delivery: ${eta}` : null,
        ]
            .filter(Boolean)
            .join("\n"),
    processing: ({ orderName }) =>
        `Your order ${orderName} is being processed and will ship soon.`,
    noOrderFound:
        "We couldn't find your order. Please reply with your order number.",
    multipleOrdersNotice: ({ orderName }) =>
        `You have multiple recent orders — this update is for ${orderName}.`,
};

const fr: ReplyStrings = {
    subjectPrefix: "Re :",
    inTransit: ({ orderName, carrier, tracking, eta }) =>
        [
            `Votre commande ${orderName} est en cours de livraison.`,
            carrier ? `Transporteur : ${carrier}` : null,
            tracking ? `Suivi : ${tracking}` : null,
            eta ? `Livraison estimée : ${eta}` : null,
        ]
            .filter(Boolean)
            .join("\n"),
    processing: ({ orderName }) =>
        `Votre commande ${orderName} est en cours de préparation et sera bientôt expédiée.`,
    noOrderFound:
        "Nous n'avons pas trouvé votre commande. Merci de répondre avec votre numéro de commande.",
    multipleOrdersNotice: ({ orderName }) =>
        `Vous avez plusieurs commandes récentes — cette mise à jour concerne ${orderName}.`,
};

const de: ReplyStrings = {
    subjectPrefix: "Re:",
    inTransit: ({ orderName, carrier, tracking, eta }) =>
        [
            `Ihre Bestellung ${orderName} ist unterwegs.`,
            carrier ? `Versanddienst: ${carrier}` : null,
            tracking ? `Sendungsverfolgung: ${tracking}` : null,
            eta ? `Voraussichtliche Lieferung: ${eta}` : null,
        ]
            .filter(Boolean)
            .join("\n"),
    processing: ({ orderName }) =>
        `Ihre Bestellung ${orderName} wird vorbereitet und in Kürze versandt.`,
    noOrderFound:
        "Wir konnten Ihre Bestellung nicht finden. Bitte antworten Sie mit Ihrer Bestellnummer.",
    multipleOrdersNotice: ({ orderName }) =>
        `Sie haben mehrere kürzliche Bestellungen — dieses Update bezieht sich auf ${orderName}.`,
};

const dictionaries: Record<Language, ReplyStrings> = { en, fr, de };

export const t = (language: string): ReplyStrings =>
    dictionaries[(language as Language) in dictionaries ? (language as Language) : "en"];

// WISMO detection keywords per spec §3, expanded by language.
export const WISMO_KEYWORDS: Record<Language, string[]> = {
    en: ["where is my order", "tracking", "delivery", "shipped", "shipping"],
    fr: ["où est ma commande", "ou est ma commande", "suivi", "colis", "livraison", "commande"],
    de: ["wo ist meine bestellung", "sendungsverfolgung", "lieferung", "versand"],
};
