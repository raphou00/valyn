import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import db from "@/lib/db";
import { createAppSubscription } from "@/lib/billing";
import { isPlanKey } from "@/config/billing";
import { getShopFromRequest, SessionTokenError } from "@/lib/shopify-session";

const Body = z.object({
    plan: z.string().refine(isPlanKey, "invalid plan"),
});

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

    const parsed = Body.safeParse(await req.json());
    if (!parsed.success) {
        return NextResponse.json({ message: "invalid plan" }, { status: 400 });
    }

    const { confirmationUrl, subscriptionId } = await createAppSubscription(
        shop.shopDomain,
        shop.accessToken,
        parsed.data.plan
    );

    await db.shop.update({
        where: { id: shop.id },
        data: {
            subscriptionId,
            subscriptionStatus: "PENDING",
            planKey: parsed.data.plan,
        },
    });

    return NextResponse.json({ confirmationUrl });
}
