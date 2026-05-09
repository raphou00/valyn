// Single-plan pricing for V1. Adjust amount/trialDays as needed.
export const PLAN = {
    name: "Pro",
    amount: 19,
    currency: "USD" as const,
    trialDays: 14,
    interval: "EVERY_30_DAYS" as const,
};

// In dev, Shopify supports test charges so we don't actually bill the partner.
export const isTestCharge = process.env.NODE_ENV !== "production";
