import { NextResponse, type NextRequest } from "next/server";
import db from "@/lib/db";
import env from "@/lib/env";
import { isValidShop } from "@/lib/shopify-domain";
import { fetchAppSubscription } from "@/lib/billing";
import { isPlanKey } from "@/config/billing";

export async function GET(req: NextRequest) {
    const params = req.nextUrl.searchParams;
    const shopDomain = params.get("shop");
    const chargeId = params.get("charge_id");

    if (!isValidShop(shopDomain)) {
        return NextResponse.json({ message: "invalid shop" }, { status: 400 });
    }

    const shop = await db.shop.findUnique({
        where: { shopDomain },
    });
    if (!shop || !shop.subscriptionId) {
        return NextResponse.json(
            { message: "no pending subscription" },
            { status: 400 }
        );
    }

    // The subscriptionId we stored is `gid://shopify/AppSubscription/<n>`;
    // Shopify's redirect carries the same numeric id as charge_id. Verify match.
    if (chargeId && !shop.subscriptionId.endsWith(`/${chargeId}`)) {
        return NextResponse.json(
            { message: "subscription mismatch" },
            { status: 400 }
        );
    }

    const sub = await fetchAppSubscription(
        shop.shopDomain,
        shop.accessToken,
        shop.subscriptionId
    );

    const planFromQuery = params.get("plan");
    const planKey = isPlanKey(planFromQuery) ? planFromQuery : shop.planKey;

    if (sub) {
        await db.shop.update({
            where: { id: shop.id },
            data: {
                subscriptionStatus: sub.status,
                planKey,
                currentPeriodEnd:
                    sub.currentPeriodEnd ?
                        new Date(sub.currentPeriodEnd)
                    :   null,
                trialEndsOn:
                    sub.trialDays > 0 && sub.createdAt ?
                        new Date(
                            new Date(sub.createdAt).getTime() +
                                sub.trialDays * 86400_000
                        )
                    :   null,
            },
        });
    }

    return NextResponse.redirect(
        `https://${shopDomain}/admin/apps/${env.SHOPIFY_API_KEY}`
    );
}
