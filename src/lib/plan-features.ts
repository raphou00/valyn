import type { PlanKey } from "@/config/billing";
import { PLANS } from "@/config/billing";
import type { Language } from "@/lib/translations";

// Per-plan capability matrix. Single source of truth: any code path that
// branches on plan reads from here, not from PLANS directly.

export type PlanCapabilities = {
    emailQuota: number;
    logRetentionDays: number;
    languages: readonly Language[];
    multipleTemplates: boolean;
    toneControl: boolean;
    manualReviewMode: boolean;
    oneClickRetry: boolean;
    prioritySupport: boolean;
};

const STARTER: PlanCapabilities = {
    emailQuota: 500,
    logRetentionDays: 7,
    languages: ["en"],
    multipleTemplates: false,
    toneControl: false,
    manualReviewMode: false,
    oneClickRetry: false,
    prioritySupport: false,
};

const PRO: PlanCapabilities = {
    emailQuota: 3000,
    logRetentionDays: 90,
    languages: ["en", "fr", "de"],
    multipleTemplates: true,
    toneControl: true,
    manualReviewMode: true,
    oneClickRetry: true,
    prioritySupport: true,
};

const BY_KEY: Record<PlanKey, PlanCapabilities> = {
    starter: STARTER,
    pro: PRO,
};

// Pre-trial / pending merchants have no plan key yet — give them Pro caps
// during the trial so the dashboard isn't crippled. Once cancelled/expired
// the BillingBanner blocks reply sending anyway.
export const capabilitiesFor = (
    planKey: string | null | undefined
): PlanCapabilities => {
    if (planKey === "starter") return STARTER;
    if (planKey === "pro") return PRO;
    return PRO;
};

export const planLabel = (planKey: string | null | undefined): string => {
    if (planKey === "starter") return PLANS.starter.name;
    if (planKey === "pro") return PLANS.pro.name;
    return "Trial";
};

export { BY_KEY };
