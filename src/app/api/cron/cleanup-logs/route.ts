import { NextResponse, type NextRequest } from "next/server";
import db from "@/lib/db";
import logger from "@/lib/logger";
import { capabilitiesFor } from "@/lib/plan-features";

// Vercel cron entry. Authenticated by the platform via the
// `x-vercel-cron-signature` header (set automatically). For belt-and-braces
// we also accept a `CRON_SECRET` Authorization: Bearer header so the same
// route can be invoked from anywhere by ops.
const isAuthorized = (req: NextRequest): boolean => {
    if (req.headers.get("x-vercel-cron") === "1") return true;
    if (req.headers.has("x-vercel-cron-signature")) return true;
    const secret = process.env.CRON_SECRET;
    if (secret && req.headers.get("authorization") === `Bearer ${secret}`)
        return true;
    return false;
};

// Plan-aware retention. Walk shops in pages, delete EmailLog rows older than
// the plan's retention window. Idempotent — safe to run any cadence.
export async function GET(req: NextRequest) {
    if (!isAuthorized(req)) {
        return NextResponse.json({ ok: false }, { status: 401 });
    }
    let deletedTotal = 0;
    const shops = await db.shop.findMany({
        select: { id: true, planKey: true, shopDomain: true },
    });
    for (const shop of shops) {
        const caps = capabilitiesFor(shop.planKey);
        const cutoff = new Date(Date.now() - caps.logRetentionDays * 86400_000);
        const { count } = await db.emailLog.deleteMany({
            where: { shopId: shop.id, receivedAt: { lt: cutoff } },
        });
        deletedTotal += count;
        if (count > 0) {
            logger.info("retention cleanup", {
                shopDomain: shop.shopDomain,
                retentionDays: caps.logRetentionDays,
                deleted: count,
            });
        }
    }
    return NextResponse.json({ ok: true, deleted: deletedTotal });
}
