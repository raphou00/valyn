import { NextResponse, type NextRequest } from "next/server";
import db from "@/lib/db";
import { withShop } from "@/lib/api-auth";
import { capabilitiesFor } from "@/lib/plan-features";
import { sendReplyForLog } from "@/lib/wismo/pipeline";

// Approve a row from the manual-review queue. Records `reviewedAt` so the
// audit trail stays clean even if the send fails.
export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    return withShop(req, async (shop) => {
        const caps = capabilitiesFor(shop.planKey);
        if (!caps.manualReviewMode) {
            return NextResponse.json(
                { message: "manual review is a Pro plan feature" },
                { status: 403 }
            );
        }

        const { id } = await params;
        const log = await db.emailLog.findUnique({ where: { id } });
        if (!log || log.shopId !== shop.id) {
            return NextResponse.json({ message: "not found" }, { status: 404 });
        }
        if (log.status !== "REVIEW") {
            return NextResponse.json(
                { message: `cannot approve status=${log.status}` },
                { status: 400 }
            );
        }

        await db.emailLog.update({
            where: { id },
            data: { reviewedAt: new Date(), status: "PENDING" },
        });
        const outcome = await sendReplyForLog(id);
        return NextResponse.json({ outcome });
    });
}
