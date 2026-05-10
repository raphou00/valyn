import type { MetadataRoute } from "next";
import { SITE_URL } from "./(public)/_lib/metadata";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: ["/api/", "/dashboard", "/settings"],
        },
        sitemap: new URL("/sitemap.xml", SITE_URL).toString(),
    };
}
