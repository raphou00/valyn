import { NextResponse, type NextRequest } from "next/server";
import db from "@/lib/db";
import { decrypt } from "@/lib/crypto";
import { verifySmtpConnection } from "@/lib/email";
import logger from "@/lib/logger";
import { withShop } from "@/lib/api-auth";

// Smoke-tests the SMTP credentials saved in Settings without sending an email.
// nodemailer.verify() opens the connection + authenticates, then closes.
// Persist the outcome (timestamp + error) so the dashboard can show health.
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
                { ok: false, message: "SMTP not fully configured" },
                { status: 400 }
            );
        }

        try {
            await verifySmtpConnection({
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
            return NextResponse.json({ ok: true });
        } catch (err) {
            const message = (err as Error).message;
            logger.warn("smtp verify failed", {
                shopId: shop.id,
                error: message,
            });
            await db.settings.update({
                where: { shopId: shop.id },
                data: { smtpLastError: message },
            });
            return NextResponse.json({ ok: false, message }, { status: 200 });
        }
    });
}
