import { NextResponse, type NextRequest } from "next/server";
import { withShop } from "@/lib/api-auth";
import { previewReply } from "@/lib/wismo/pipeline";

// Returns the reply Valyn would send for a synthetic WISMO email matched to
// the merchant's most recent order. Read-only — never sends mail or writes
// EmailLog. Powers the dashboard's "Send a test email" CTA.
export async function POST(req: NextRequest) {
    return withShop(req, async (shop) => {
        const result = await previewReply(shop.id);
        if ("error" in result) {
            return NextResponse.json(
                { ok: false, message: result.error },
                { status: 400 }
            );
        }
        return NextResponse.json({ ok: true, preview: result });
    });
}
