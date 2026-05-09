import { NextResponse, type NextRequest } from "next/server";
import db from "@/lib/db";
import {
    getShopFromRequest,
    SessionTokenError,
} from "@/lib/shopify-session";

const PAGE_SIZE = 25;

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

    const page = Math.max(
        0,
        parseInt(req.nextUrl.searchParams.get("page") ?? "0", 10)
    );

    const [rows, total] = await Promise.all([
        db.emailLog.findMany({
            where: { shopId: shop.id },
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
            },
        }),
        db.emailLog.count({ where: { shopId: shop.id } }),
    ]);

    return NextResponse.json({
        logs: rows,
        page,
        pageSize: PAGE_SIZE,
        total,
        hasMore: (page + 1) * PAGE_SIZE < total,
    });
}
