import { NextResponse, type NextRequest } from "next/server";
import db from "@/lib/db";
import { createAppSubscription } from "@/lib/billing";
import {
    getShopFromRequest,
    SessionTokenError,
} from "@/lib/shopify-session";

export async function POST(req: NextRequest) {
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

    const { confirmationUrl, subscriptionId } = await createAppSubscription(
        shop.shopDomain,
        shop.accessToken
    );

    await db.shop.update({
        where: { id: shop.id },
        data: { subscriptionId, subscriptionStatus: "PENDING" },
    });

    return NextResponse.json({ confirmationUrl });
}
