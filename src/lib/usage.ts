import db from "./db";
import { capabilitiesFor } from "./plan-features";

// Billing period: 30-day rolling window anchored on `currentPeriodEnd` when
// available; otherwise the last 30 days. This matches what merchants see in
// Shopify Billing.
export const billingPeriodStart = (
    currentPeriodEnd: Date | null | undefined
): Date => {
    if (currentPeriodEnd) {
        const start = new Date(currentPeriodEnd);
        start.setUTCDate(start.getUTCDate() - 30);
        return start;
    }
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - 30);
    return d;
};

export type UsageSnapshot = {
    used: number;
    quota: number;
    remaining: number;
    periodStart: Date;
    periodEnd: Date | null;
    overQuota: boolean;
    nearLimit: boolean; // >= 80%
};

export const getUsage = async (shop: {
    id: string;
    planKey: string | null;
    currentPeriodEnd: Date | null;
}): Promise<UsageSnapshot> => {
    const caps = capabilitiesFor(shop.planKey);
    const periodStart = billingPeriodStart(shop.currentPeriodEnd);
    const used = await db.emailLog.count({
        where: {
            shopId: shop.id,
            receivedAt: { gte: periodStart },
        },
    });
    const remaining = Math.max(0, caps.emailQuota - used);
    return {
        used,
        quota: caps.emailQuota,
        remaining,
        periodStart,
        periodEnd: shop.currentPeriodEnd,
        overQuota: used >= caps.emailQuota,
        nearLimit: used / caps.emailQuota >= 0.8,
    };
};
