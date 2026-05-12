import { NextResponse, type NextRequest } from "next/server";
import { getShopFromRequest, SessionTokenError } from "@/lib/shopify-session";

export type AuthedShop = Awaited<ReturnType<typeof getShopFromRequest>>;

// Wrap a handler that needs an authed shop. Returns a 401 NextResponse if
// the session token is missing/invalid, otherwise calls the handler with the
// resolved Shop.
export const withShop = async (
    req: NextRequest,
    handler: (shop: AuthedShop) => Promise<NextResponse>
): Promise<NextResponse> => {
    let shop: AuthedShop;
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
    return handler(shop);
};
