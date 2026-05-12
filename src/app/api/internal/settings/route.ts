import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import db from "@/lib/db";
import { encrypt } from "@/lib/crypto";
import { withShop } from "@/lib/api-auth";
import { capabilitiesFor } from "@/lib/plan-features";

const PatchBody = z.object({
    autoReplyEnabled: z.boolean().optional(),
    responseDelaySeconds: z.number().int().min(0).max(86400).optional(),
    language: z.enum(["en", "fr", "de"]).optional(),
    tone: z.enum(["NEUTRAL", "FRIENDLY", "FORMAL"]).optional(),
    strictness: z
        .enum(["AUTO_REPLY", "REVIEW_QUEUE", "PASS_THROUGH"])
        .optional(),
    fallbackBehavior: z
        .enum(["SEND_FALLBACK", "QUEUE_REVIEW", "SKIP"])
        .optional(),
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

export async function GET(req: NextRequest) {
    return withShop(req, async (shop) => {
        const s = shop.settings;
        if (!s) return NextResponse.json({ settings: null });

        const caps = capabilitiesFor(shop.planKey);

        return NextResponse.json({
            settings: {
                autoReplyEnabled: s.autoReplyEnabled,
                responseDelaySeconds: s.responseDelaySeconds,
                language: s.language,
                tone: s.tone,
                strictness: s.strictness,
                fallbackBehavior: s.fallbackBehavior,
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
                smtpLastVerifiedAt: s.smtpLastVerifiedAt,
                smtpLastError: s.smtpLastError,
            },
            plan: {
                key: shop.planKey,
                languages: caps.languages,
                toneControl: caps.toneControl,
                manualReviewMode: caps.manualReviewMode,
                multipleTemplates: caps.multipleTemplates,
            },
        });
    });
}

export async function PATCH(req: NextRequest) {
    return withShop(req, async (shop) => {
        const parsed = PatchBody.safeParse(await req.json());
        if (!parsed.success) {
            return NextResponse.json(
                { message: "invalid", errors: parsed.error.flatten() },
                { status: 400 }
            );
        }

        const caps = capabilitiesFor(shop.planKey);

        // Gate Pro-only knobs at the API layer so a client that bypasses the
        // UI can't sneak them through.
        if (
            parsed.data.tone &&
            parsed.data.tone !== "NEUTRAL" &&
            !caps.toneControl
        ) {
            return NextResponse.json(
                { message: "tone control is a Pro plan feature" },
                { status: 403 }
            );
        }
        if (
            parsed.data.strictness &&
            parsed.data.strictness === "REVIEW_QUEUE" &&
            !caps.manualReviewMode
        ) {
            return NextResponse.json(
                { message: "review queue is a Pro plan feature" },
                { status: 403 }
            );
        }

        const { smtpPass, ...rest } = parsed.data;
        const data: Record<string, unknown> = { ...rest };
        if (smtpPass !== undefined) data.smtpPassEnc = encrypt(smtpPass);
        // Any SMTP field change invalidates the last-verified marker.
        const smtpChanged =
            "smtpHost" in rest ||
            "smtpPort" in rest ||
            "smtpUser" in rest ||
            "smtpFromAddress" in rest ||
            smtpPass !== undefined;
        if (smtpChanged) {
            data.smtpLastVerifiedAt = null;
            data.smtpLastError = null;
        }

        await db.settings.update({
            where: { shopId: shop.id },
            data,
        });

        return NextResponse.json({ ok: true });
    });
}
