import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import db from "@/lib/db";
import { encrypt } from "@/lib/crypto";
import { getShopFromRequest, SessionTokenError } from "@/lib/shopify-session";

const PatchBody = z.object({
    autoReplyEnabled: z.boolean().optional(),
    responseDelaySeconds: z.number().int().min(0).max(86400).optional(),
    language: z.enum(["en", "fr", "de"]).optional(),
    tone: z.enum(["NEUTRAL", "FRIENDLY", "FORMAL"]).optional(),
    greeting: z.string().max(500).optional(),
    signature: z.string().max(500).optional(),
    supportEmail: z.string().email().nullable().optional(),

    smtpHost: z.string().nullable().optional(),
    smtpPort: z.number().int().min(1).max(65535).nullable().optional(),
    smtpSecure: z.boolean().optional(),
    smtpUser: z.string().nullable().optional(),
    smtpPass: z.string().min(1).optional(),
    smtpFromName: z.string().nullable().optional(),
    smtpFromAddress: z.string().email().nullable().optional(),
});

const respond401 = () =>
    NextResponse.json({ message: "unauthorized" }, { status: 401 });

export async function GET(req: NextRequest) {
    let shop;
    try {
        shop = await getShopFromRequest(req);
    } catch (err) {
        if (err instanceof SessionTokenError) return respond401();
        throw err;
    }

    const s = shop.settings;
    if (!s) return NextResponse.json({ settings: null });

    return NextResponse.json({
        settings: {
            autoReplyEnabled: s.autoReplyEnabled,
            responseDelaySeconds: s.responseDelaySeconds,
            language: s.language,
            tone: s.tone,
            greeting: s.greeting,
            signature: s.signature,
            supportEmail: s.supportEmail,
            inboundAddress: s.inboundAddress,
            smtpHost: s.smtpHost,
            smtpPort: s.smtpPort,
            smtpSecure: s.smtpSecure,
            smtpUser: s.smtpUser,
            smtpFromName: s.smtpFromName,
            smtpFromAddress: s.smtpFromAddress,
            hasSmtpPass: Boolean(s.smtpPassEnc),
        },
    });
}

export async function PATCH(req: NextRequest) {
    let shop;
    try {
        shop = await getShopFromRequest(req);
    } catch (err) {
        if (err instanceof SessionTokenError) return respond401();
        throw err;
    }

    const parsed = PatchBody.safeParse(await req.json());
    if (!parsed.success) {
        return NextResponse.json(
            { message: "invalid", errors: parsed.error.flatten() },
            { status: 400 }
        );
    }

    const { smtpPass, ...rest } = parsed.data;
    const data: Record<string, unknown> = { ...rest };
    if (smtpPass !== undefined) data.smtpPassEnc = encrypt(smtpPass);

    await db.settings.update({
        where: { shopId: shop.id },
        data,
    });

    return NextResponse.json({ ok: true });
}
