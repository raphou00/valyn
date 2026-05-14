import type { Metadata } from "next";

export const SITE_URL = "https://getvalyn.com";
export const SUPPORT_EMAIL = "support@getvalyn.com";
export const INSTALL_HREF = "/install";
export const DEMO_HREF = "/demo";

type MetadataInput = {
    title: string;
    description: string;
    path: string;
    type?: "website" | "article";
};

export const absoluteUrl = (path: string): string =>
    new URL(path, SITE_URL).toString();

export const marketingMetadata = ({
    title,
    description,
    path,
    type = "website",
}: MetadataInput): Metadata => ({
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
        title,
        description,
        url: absoluteUrl(path),
        siteName: "Valyn",
        type,
        images: [
            {
                url: "/opengraph-image",
                width: 1200,
                height: 630,
                alt: "Valyn Shopify order support automation",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title,
        description,
        images: ["/opengraph-image"],
    },
});
