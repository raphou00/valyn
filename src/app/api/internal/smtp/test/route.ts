import { NextResponse, type NextRequest } from "next/server";
import { decrypt } from "@/lib/crypto";
import { verifySmtpConnection } from "@/lib/email";
import logger from "@/lib/logger";
import {
    getShopFromRequest,
    SessionTokenError,
} from "@/lib/shopify-session";

// Smoke-tests the SMTP credentials saved in Settings without sending an email.
// nodemailer.verify() opens the connection + authenticates, then closes.
export async function POST(req: NextRequest) {
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
        return NextResponse.json({ ok: true });
    } catch (err) {
        logger.warn("smtp verify failed", {
            shopId: shop.id,
            error: (err as Error).message,
        });
        return NextResponse.json(
            { ok: false, message: (err as Error).message },
            { status: 200 }
        );
    }
}
