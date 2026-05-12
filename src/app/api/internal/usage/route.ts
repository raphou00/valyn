import { NextResponse, type NextRequest } from "next/server";
import { withShop } from "@/lib/api-auth";
import { capabilitiesFor } from "@/lib/plan-features";
import { getUsage } from "@/lib/usage";

export async function GET(req: NextRequest) {
    return withShop(req, async (shop) => {
        const caps = capabilitiesFor(shop.planKey);
        const usage = await getUsage({
            id: shop.id,
            planKey: shop.planKey,
            currentPeriodEnd: shop.currentPeriodEnd,
        });
        return NextResponse.json({
            usage,
            plan: {
                key: shop.planKey,
                quota: caps.emailQuota,
                retentionDays: caps.logRetentionDays,
                languages: caps.languages,
                multipleTemplates: caps.multipleTemplates,
                toneControl: caps.toneControl,
                manualReviewMode: caps.manualReviewMode,
                oneClickRetry: caps.oneClickRetry,
            },
            subscription: {
                status: shop.subscriptionStatus,
                trialEndsOn: shop.trialEndsOn,
                currentPeriodEnd: shop.currentPeriodEnd,
            },
        });
    });
}
