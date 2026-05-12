import { NextResponse, type NextRequest } from "next/server";
import db from "@/lib/db";
import { withShop } from "@/lib/api-auth";

const PAGE_SIZE = 25;

const STATUSES = [
    "PENDING",
    "REPLIED",
    "FAILED",
    "IGNORED",
    "REVIEW",
    "LIMIT_EXCEEDED",
    "MISCLASSIFIED",
] as const;
type Status = (typeof STATUSES)[number];

const INTENTS = ["WISMO", "OTHER"] as const;
type IntentFilter = (typeof INTENTS)[number];

const parseStatus = (raw: string | null): Status | undefined =>
    STATUSES.find((s) => s === raw);
const parseIntent = (raw: string | null): IntentFilter | undefined =>
    INTENTS.find((i) => i === raw);
const parseDate = (raw: string | null): Date | undefined => {
    if (!raw) return undefined;
    const d = new Date(raw);
    return Number.isNaN(d.getTime()) ? undefined : d;
};

export async function GET(req: NextRequest) {
    return withShop(req, async (shop) => {
        const sp = req.nextUrl.searchParams;
        const page = Math.max(0, parseInt(sp.get("page") ?? "0", 10));
        const status = parseStatus(sp.get("status"));
        const intent = parseIntent(sp.get("intent"));
        const from = parseDate(sp.get("from"));
        const to = parseDate(sp.get("to"));
        const q = sp.get("q")?.trim() ?? "";

        const where = {
            shopId: shop.id,
            ...(status ? { status } : {}),
            ...(intent ? { intent } : {}),
            ...(from || to ?
                {
                    receivedAt: {
                        ...(from ? { gte: from } : {}),
                        ...(to ? { lte: to } : {}),
                    },
                }
            :   {}),
            ...(q ?
                {
                    OR: [
                        { senderEmail: { contains: q, mode: "insensitive" as const } },
                        { subject: { contains: q, mode: "insensitive" as const } },
                        { orderName: { contains: q, mode: "insensitive" as const } },
                    ],
                }
            :   {}),
        };

        const [rows, total] = await Promise.all([
            db.emailLog.findMany({
                where,
                orderBy: { receivedAt: "desc" },
                take: PAGE_SIZE,
                skip: page * PAGE_SIZE,
                select: {
                    id: true,
                    senderEmail: true,
                    subject: true,
                    intent: true,
                    status: true,
                    orderName: true,
                    errorMessage: true,
                    receivedAt: true,
                    repliedAt: true,
                    confidence: true,
                    detectedLanguage: true,
                    retryCount: true,
                },
            }),
            db.emailLog.count({ where }),
        ]);

        return NextResponse.json({
            logs: rows,
            page,
            pageSize: PAGE_SIZE,
            total,
            hasMore: (page + 1) * PAGE_SIZE < total,
        });
    });
}
