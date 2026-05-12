import type { MetadataRoute } from "next";
import { SITE_URL } from "./(public)/_lib/metadata";

const routes = [
    "/",
    "/features",
    "/features/order-tracking-automation",
    "/features/wismo-automation",
    "/features/customer-support-automation",
    "/pricing",
    "/demo",
    "/faq",
    "/contact",
    "/shopify-order-tracking-automation",
    "/reduce-wismo-tickets-shopify",
    "/shopify-customer-support-automation",
    "/gorgias-alternative",
    "/aftership-alternative",
    "/shopify-helpdesk-alternative",
    "/blog",
    "/blog/what-is-wismo",
    "/blog/how-to-reduce-shopify-support-tickets",
    "/blog/best-shopify-customer-support-apps",
    "/blog/how-to-automate-shopify-order-tracking-emails",
    "/legal/terms",
    "/legal/privacy",
    "/legal/cookies",
    "/legal/data-processing-agreement",
    "/legal/gdpr",
    "/legal/security",
];

export default function sitemap(): MetadataRoute.Sitemap {
    // Use deploy time so search engines see a fresh `lastmod` every release.
    const lastModified = new Date();

    return routes.map((route) => {
        const isHome = route === "/";
        const isBlog = route.startsWith("/blog");
        const isLegal = route.startsWith("/legal/");
        return {
            url: new URL(route, SITE_URL).toString(),
            lastModified,
            changeFrequency:
                isHome ? "weekly"
                : isBlog ? "monthly"
                : isLegal ? "yearly"
                : "monthly",
            priority:
                isHome ? 1
                : isLegal ? 0.3
                : 0.7,
        };
    });
}
