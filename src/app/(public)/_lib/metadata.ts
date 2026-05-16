import type { Metadata } from "next";

export const SITE_URL = "https://getvalyn.com";
export const SITE_NAME = "Valyn";
export const TAGLINE = 'Automated "Where is my order?" support for Shopify';
export const SUPPORT_EMAIL = "support@getvalyn.com";
export const INSTALL_HREF = "/install";
export const DEMO_HREF = "/demo";

const DEFAULT_DESCRIPTION =
    "Valyn detects customer emails about orders, finds the matching Shopify order, and replies automatically with accurate tracking information.";

const KEYWORDS = [
    "Shopify WISMO",
    "where is my order",
    "Shopify order tracking automation",
    "Shopify customer support automation",
    "automated order status replies",
    "Shopify support app",
    "ecommerce support automation",
];

const CATEGORY = "Business Software";
const OG_IMAGE = "/opengraph-image";

type MetadataInput = {
    title: string;
    description: string;
    path: string;
    type?: "website" | "article";
};

export const absoluteUrl = (path: string): string =>
    new URL(path, SITE_URL).toString();

// Shared defaults applied site-wide via the (public) root layout. Next.js
// deep-merges this with per-page metadata, so pages only need to override
// title/description/canonical/og:url.
export const baseMetadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: `${SITE_NAME} | ${TAGLINE}`,
        template: `%s | ${SITE_NAME}`,
    },
    description: DEFAULT_DESCRIPTION,
    abstract: TAGLINE,
    keywords: KEYWORDS,
    applicationName: SITE_NAME,
    category: CATEGORY,
    classification: CATEGORY,
    referrer: "origin-when-cross-origin",
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    formatDetection: { email: false, address: false, telephone: false },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
        },
    },
    openGraph: {
        type: "website",
        title: `${SITE_NAME} | ${TAGLINE}`,
        siteName: SITE_NAME,
        description: DEFAULT_DESCRIPTION,
        url: SITE_URL,
        locale: "en_US",
        images: [
            {
                url: OG_IMAGE,
                width: 1200,
                height: 630,
                alt: `${SITE_NAME} — ${TAGLINE}`,
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: `${SITE_NAME} | ${TAGLINE}`,
        description: DEFAULT_DESCRIPTION,
        images: [OG_IMAGE],
    },
    alternates: {
        canonical: SITE_URL,
        languages: { "x-default": SITE_URL, en: SITE_URL },
    },
    icons: {
        icon: [
            { url: "/favicon.ico", sizes: "any" },
            { url: "/favicon.svg", type: "image/svg+xml" },
            { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
        ],
        apple: "/apple-touch-icon.png",
    },
    manifest: "/manifest.webmanifest",
};

// Per-page metadata. `title.absolute` keeps each page's descriptive title
// intact (no "| Valyn" suffix doubling on already-branded titles) while the
// layout template still covers any page that omits a title.
export const marketingMetadata = ({
    title,
    description,
    path,
    type = "website",
}: MetadataInput): Metadata => {
    const url = absoluteUrl(path);
    return {
        title: { absolute: title },
        description,
        alternates: {
            canonical: path,
            languages: { "x-default": url, en: url },
        },
        openGraph: {
            type,
            title,
            description,
            url,
            siteName: SITE_NAME,
            locale: "en_US",
            images: [
                {
                    url: OG_IMAGE,
                    width: 1200,
                    height: 630,
                    alt: `${SITE_NAME} — ${TAGLINE}`,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [OG_IMAGE],
        },
    };
};
