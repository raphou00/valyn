import { NextResponse, type NextRequest } from "next/server";
import db from "@/lib/db";
import { withShop } from "@/lib/api-auth";

const CSV_COLUMNS = [
    "id",
    "receivedAt",
    "senderEmail",
    "subject",
    "intent",
    "status",
    "orderName",
    "errorMessage",
    "repliedAt",
    "detectedLanguage",
    "confidence",
    "retryCount",
];

const escape = (v: unknown): string => {
    if (v === null || v === undefined) return "";
    const s = v instanceof Date ? v.toISOString() : String(v);
    if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
};

export async function GET(req: NextRequest) {
    return withShop(req, async (shop) => {
        const rows = await db.emailLog.findMany({
            where: { shopId: shop.id },
            orderBy: { receivedAt: "desc" },
            // Hard cap so a misclick can't kill the function.
            take: 10000,
        });

        const header = CSV_COLUMNS.join(",");
        const body = rows
            .map((r) =>
                CSV_COLUMNS.map((c) => escape((r as Record<string, unknown>)[c])).join(",")
            )
            .join("\n");
        const csv = `${header}\n${body}\n`;

        return new NextResponse(csv, {
            status: 200,
            headers: {
                "Content-Type": "text/csv; charset=utf-8",
                "Content-Disposition": `attachment; filename="valyn-logs-${new Date().toISOString().slice(0, 10)}.csv"`,
            },
        });
    });
}
