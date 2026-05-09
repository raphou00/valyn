import { NextResponse, type NextRequest } from "next/server";
import db from "@/lib/db";
import {
    getShopFromRequest,
    SessionTokenError,
} from "@/lib/shopify-session";

export async function GET(req: NextRequest) {
    let shop;
    try {
        shop = await getShopFromRequest(req);
    } catch (err) {
        if (err instanceof SessionTokenError) {
            return NextResponse.json(
                { message: "unauthorized" },
                { status: 401 }
            );
        }
        throw err;
    }

    const [total, wismo, replied, failed] = await Promise.all([
        db.emailLog.count({ where: { shopId: shop.id } }),
        db.emailLog.count({ where: { shopId: shop.id, intent: "WISMO" } }),
        db.emailLog.count({ where: { shopId: shop.id, status: "REPLIED" } }),
        db.emailLog.count({ where: { shopId: shop.id, status: "FAILED" } }),
    ]);

    return NextResponse.json({
        stats: { total, wismo, replied, failed },
        subscription: {
            status: shop.subscriptionStatus,
            trialEndsOn: shop.trialEndsOn,
            currentPeriodEnd: shop.currentPeriodEnd,
        },
    });
}
