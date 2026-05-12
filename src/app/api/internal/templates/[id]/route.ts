import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import db from "@/lib/db";
import { withShop } from "@/lib/api-auth";
import { capabilitiesFor } from "@/lib/plan-features";

const Update = z.object({
    name: z.string().min(1).max(80).optional(),
    body: z.string().min(1).max(4000).optional(),
    isDefault: z.boolean().optional(),
});

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    return withShop(req, async (shop) => {
        const caps = capabilitiesFor(shop.planKey);
        if (!caps.multipleTemplates) {
            return NextResponse.json(
                { message: "multiple templates is a Pro plan feature" },
                { status: 403 }
            );
        }
        const { id } = await params;
        const existing = await db.replyTemplate.findUnique({ where: { id } });
        if (!existing || existing.shopId !== shop.id) {
            return NextResponse.json({ message: "not found" }, { status: 404 });
        }
        const parsed = Update.safeParse(await req.json());
        if (!parsed.success) {
            return NextResponse.json(
                { message: "invalid", errors: parsed.error.flatten() },
                { status: 400 }
            );
        }
        if (parsed.data.isDefault) {
            await db.replyTemplate.updateMany({
                where: {
                    shopId: shop.id,
                    type: existing.type,
                    isDefault: true,
                    NOT: { id },
                },
                data: { isDefault: false },
            });
        }
        const tpl = await db.replyTemplate.update({
            where: { id },
            data: parsed.data,
        });
        return NextResponse.json({ template: tpl });
    });
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    return withShop(req, async (shop) => {
        const { id } = await params;
        const existing = await db.replyTemplate.findUnique({ where: { id } });
        if (!existing || existing.shopId !== shop.id) {
            return NextResponse.json({ message: "not found" }, { status: 404 });
        }
        await db.replyTemplate.delete({ where: { id } });
        return NextResponse.json({ ok: true });
    });
}
