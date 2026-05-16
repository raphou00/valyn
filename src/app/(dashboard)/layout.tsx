import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import env from "@/lib/env";
import RootProviders from "../providers";
import DashboardShell from "./_components/dashboard-shell";
import "@/styles/globals.css";

// Root layout for the embedded admin. App Bridge demands a synchronous
// <script> (no async/defer/module) as the first script in <head>;
// next/script injects `async`, so use a raw <script>. This document is
// served ONLY for dashboard routes — marketing pages have their own root
// layout without App Bridge (multiple root layouts; no shared app/layout).

export const metadata: Metadata = {
    metadataBase: new URL("https://getvalyn.com"),
    title: "Valyn",
    description: "Automated WISMO replies for Shopify stores.",
};

const Layout: React.FC<React.PropsWithChildren> = ({ children }) => (
    <html lang="en" suppressHydrationWarning>
        <head>
            <meta name="shopify-api-key" content={env.SHOPIFY_API_KEY} />
            {/* eslint-disable-next-line @next/next/no-sync-scripts */}
            <script src="https://cdn.shopify.com/shopifycloud/app-bridge.js" />
        </head>
        <body>
            <RootProviders>
                <DashboardShell>{children}</DashboardShell>
            </RootProviders>
            <Analytics />
            <SpeedInsights />
        </body>
    </html>
);

export default Layout;
