import type { Metadata } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import env from "@/lib/env";
import RootProviders from "./providers";
import "@/styles/globals.css";

// Note: App Bridge script + meta tag are loaded site-wide (not just under
// /dashboard). On public marketing pages App Bridge stays inert because
// there's no embedded admin context. Next's `strategy="beforeInteractive"`
// only works in the root layout, so we accept the small bandwidth cost in
// exchange for correctness when the embedded admin loads.

export const metadata: Metadata = {
    metadataBase: new URL("https://getvalyn.com"),
    title: "Valyn",
    description: "Automated WISMO replies for Shopify stores.",
};

const Root: React.FC<React.PropsWithChildren> = ({ children }) => {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <meta name="shopify-api-key" content={env.SHOPIFY_API_KEY} />
                <Script
                    src="https://cdn.shopify.com/shopifycloud/app-bridge.js"
                    strategy="beforeInteractive"
                />
            </head>
            <body>
                <RootProviders>{children}</RootProviders>
                <Analytics />
                <SpeedInsights />
            </body>
        </html>
    );
};

export default Root;
