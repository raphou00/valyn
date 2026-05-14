import { NextResponse, type NextRequest } from "next/server";
import db from "@/lib/db";
import { decrypt } from "@/lib/crypto";
import { sendSmtpTestEmail } from "@/lib/email";
import logger from "@/lib/logger";
import { withShop } from "@/lib/api-auth";
import { humanizeSmtpError } from "@/lib/smtp-errors";

// Sends a real test email from the merchant to themselves so they can
// confirm delivery, not just authentication. Persists the outcome so the
// dashboard can show health.
export async function POST(req: NextRequest) {
    return withShop(req, async (shop) => {
        const s = shop.settings;
        if (
            !s ||
            !s.smtpHost ||
            !s.smtpPort ||
            !s.smtpUser ||
            !s.smtpPassEnc ||
            !s.smtpFromAddress
        ) {
            return NextResponse.json(
                {
                    ok: false,
                    message: humanizeSmtpError("smtp not configured"),
                },
                { status: 400 }
            );
        }

        try {
            await sendSmtpTestEmail({
                host: s.smtpHost,
                port: s.smtpPort,
                secure: s.smtpSecure,
                user: s.smtpUser,
                pass: decrypt(s.smtpPassEnc),
                fromName: s.smtpFromName ?? s.smtpFromAddress,
                fromAddress: s.smtpFromAddress,
            });
            await db.settings.update({
                where: { shopId: shop.id },
                data: { smtpLastVerifiedAt: new Date(), smtpLastError: null },
            });
            return NextResponse.json({
                ok: true,
                sentTo: s.smtpFromAddress,
            });
        } catch (err) {
            const raw = (err as Error).message;
            const message = humanizeSmtpError(raw);
            logger.warn("smtp test send failed", {
                shopId: shop.id,
                error: raw,
            });
            await db.settings.update({
                where: { shopId: shop.id },
                data: { smtpLastError: message },
            });
            return NextResponse.json({ ok: false, message }, { status: 200 });
        }
    });
}
