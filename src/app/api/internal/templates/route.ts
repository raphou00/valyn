import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import db from "@/lib/db";
import { withShop } from "@/lib/api-auth";
import { capabilitiesFor } from "@/lib/plan-features";

const TYPES = ["IN_TRANSIT", "PROCESSING", "NO_ORDER", "MULTIPLE"] as const;
const NewTemplate = z.object({
    type: z.enum(TYPES),
    name: z.string().min(1).max(80),
    body: z.string().min(1).max(4000),
    isDefault: z.boolean().optional(),
});

export async function GET(req: NextRequest) {
    return withShop(req, async (shop) => {
        const templates = await db.replyTemplate.findMany({
            where: { shopId: shop.id },
            orderBy: [{ type: "asc" }, { isDefault: "desc" }, { name: "asc" }],
        });
        return NextResponse.json({ templates });
    });
}

export async function POST(req: NextRequest) {
    return withShop(req, async (shop) => {
        const caps = capabilitiesFor(shop.planKey);
        if (!caps.multipleTemplates) {
            return NextResponse.json(
                { message: "multiple templates is a Pro plan feature" },
                { status: 403 }
            );
        }
        const parsed = NewTemplate.safeParse(await req.json());
        if (!parsed.success) {
            return NextResponse.json(
                { message: "invalid", errors: parsed.error.flatten() },
                { status: 400 }
            );
        }
        // If isDefault: clear any existing default for the same type.
        if (parsed.data.isDefault) {
            await db.replyTemplate.updateMany({
                where: {
                    shopId: shop.id,
                    type: parsed.data.type,
                    isDefault: true,
                },
                data: { isDefault: false },
            });
        }
        const tpl = await db.replyTemplate.create({
            data: {
                shopId: shop.id,
                type: parsed.data.type,
                name: parsed.data.name,
                body: parsed.data.body,
                isDefault: parsed.data.isDefault ?? false,
            },
        });
        return NextResponse.json({ template: tpl }, { status: 201 });
    });
}
