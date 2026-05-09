import type { Metadata } from "next";
import Script from "next/script";
import env from "@/lib/env";
import RootProviders from "./providers";
import "@/styles/globals.css";

export const metadata: Metadata = {
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
            </body>
        </html>
    );
};

export default Root;
