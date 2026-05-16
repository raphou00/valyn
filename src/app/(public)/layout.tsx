import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import RootProviders from "../providers";
import { OrganizationJsonLd, WebSiteJsonLd } from "./_components/jsonld";
import "@/styles/globals.css";

// Root layout for the public marketing site. Deliberately ships NO App
// Bridge — that script is embedded-admin only and lives in the dashboard
// root layout. Keeping it off marketing pages removes a render-blocking
// third-party script from the FCP/SEO-critical surface. Multiple root
// layouts: this owns its own <html>/<body> (there is no shared app/layout).

export const metadata: Metadata = {
    metadataBase: new URL("https://getvalyn.com"),
    title: "Valyn",
    description: "Automated WISMO replies for Shopify stores.",
};

const Layout: React.FC<React.PropsWithChildren> = ({ children }) => (
    <html lang="en" suppressHydrationWarning>
        <body>
            <RootProviders>
                <div className="min-h-screen bg-base-100 leading-normal text-base-content">
                    <OrganizationJsonLd />
                    <WebSiteJsonLd />
                    {children}
                </div>
            </RootProviders>
            <Analytics />
            <SpeedInsights />
        </body>
    </html>
);

export default Layout;
