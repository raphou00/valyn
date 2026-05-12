import { NextResponse, type NextRequest } from "next/server";
import db from "@/lib/db";
import { withShop } from "@/lib/api-auth";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    return withShop(req, async (shop) => {
        const { id } = await params;
        const log = await db.emailLog.findUnique({ where: { id } });
        if (!log || log.shopId !== shop.id) {
            return NextResponse.json({ message: "not found" }, { status: 404 });
        }
        return NextResponse.json({ log });
    });
}
