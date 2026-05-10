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
    const lastModified = new Date("2026-05-10");

    return routes.map((route) => ({
        url: new URL(route, SITE_URL).toString(),
        lastModified,
        changeFrequency: route === "/" ? "weekly" : "monthly",
        priority: route === "/" ? 1 : 0.7,
    }));
}
