import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import env from "@/lib/env";
import RootProviders from "./providers";
import "@/styles/globals.css";

// App Bridge demands a synchronous <script> tag with no async/defer/module
// attributes, loaded before any other script. next/script injects `async`
// regardless of strategy, so use a raw <script> element here.

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
                {/* eslint-disable-next-line @next/next/no-sync-scripts */}
                <script src="https://cdn.shopify.com/shopifycloud/app-bridge.js" />
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
