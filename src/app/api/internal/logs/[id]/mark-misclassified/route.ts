import { NextResponse, type NextRequest } from "next/server";
import db from "@/lib/db";
import { withShop } from "@/lib/api-auth";

// Flag a row as misclassified. Status moves to MISCLASSIFIED so the merchant
// can filter on it and the false-positive rate is tracked over time.
export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    return withShop(req, async (shop) => {
        const { id } = await params;
        const log = await db.emailLog.findUnique({ where: { id } });
        if (!log || log.shopId !== shop.id) {
            return NextResponse.json({ message: "not found" }, { status: 404 });
        }
        await db.emailLog.update({
            where: { id },
            data: {
                status: "MISCLASSIFIED",
                manuallyMarked: true,
                reviewedAt: new Date(),
            },
        });
        return NextResponse.json({ ok: true });
    });
}
