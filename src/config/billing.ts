// Subscription plans surfaced to merchants. Keep keys stable — they're
// referenced in BillingBanner UI + Shop.planKey in the DB.

export type PlanKey = "starter" | "pro";

export type Plan = {
    key: PlanKey;
    name: string;
    amount: number;
    currency: "USD";
    trialDays: number;
    interval: "EVERY_30_DAYS";
    description: string;
    emailQuota: number;
};

export const PLANS: Record<PlanKey, Plan> = {
    starter: {
        key: "starter",
        name: "Starter",
        amount: 19,
        currency: "USD",
        trialDays: 7,
        interval: "EVERY_30_DAYS",
        description: "For small stores getting started with automation.",
        emailQuota: 500,
    },
    pro: {
        key: "pro",
        name: "Pro",
        amount: 49,
        currency: "USD",
        trialDays: 7,
        interval: "EVERY_30_DAYS",
        description: "For growing stores handling larger support volume.",
        emailQuota: 3000,
    },
};

export const DEFAULT_PLAN: PlanKey = "pro";

export const isPlanKey = (s: string | null | undefined): s is PlanKey =>
    s === "starter" || s === "pro";

export const isTestCharge = process.env.NODE_ENV !== "production";
