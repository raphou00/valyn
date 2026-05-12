import { SITE_URL, SUPPORT_EMAIL } from "../_lib/metadata";

const json = (data: Record<string, unknown>) => JSON.stringify(data);

// Rendered as <script type="application/ld+json"> in the document body.
// React 19 doesn't need `dangerouslySetInnerHTML` for inert script tags but
// we use it to keep the markup unescaped (Google parses this verbatim).

export const OrganizationJsonLd: React.FC = () => (
    <script
        type="application/ld+json"
         
        dangerouslySetInnerHTML={{
            __html: json({
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "Valyn",
                url: SITE_URL,
                logo: `${SITE_URL}/opengraph-image`,
                email: SUPPORT_EMAIL,
                sameAs: [],
            }),
        }}
    />
);

export const WebSiteJsonLd: React.FC = () => (
    <script
        type="application/ld+json"
         
        dangerouslySetInnerHTML={{
            __html: json({
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: "Valyn",
                url: SITE_URL,
            }),
        }}
    />
);

export const SoftwareAppJsonLd: React.FC = () => (
    <script
        type="application/ld+json"
         
        dangerouslySetInnerHTML={{
            __html: json({
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                name: "Valyn",
                operatingSystem: "Web",
                applicationCategory: "BusinessApplication",
                description:
                    "Shopify app that automatically replies to “Where is my order?” customer emails using real order and tracking data.",
                offers: [
                    {
                        "@type": "Offer",
                        name: "Starter",
                        price: "19",
                        priceCurrency: "USD",
                    },
                    {
                        "@type": "Offer",
                        name: "Pro",
                        price: "49",
                        priceCurrency: "USD",
                    },
                ],
                url: SITE_URL,
            }),
        }}
    />
);

export const FaqJsonLd: React.FC<{
    items: { question: string; answer: string }[];
}> = ({ items }) => (
    <script
        type="application/ld+json"
         
        dangerouslySetInnerHTML={{
            __html: json({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: items.map((it) => ({
                    "@type": "Question",
                    name: it.question,
                    acceptedAnswer: {
                        "@type": "Answer",
                        text: it.answer,
                    },
                })),
            }),
        }}
    />
);

export const BreadcrumbJsonLd: React.FC<{
    items: { name: string; url: string }[];
}> = ({ items }) => (
    <script
        type="application/ld+json"
         
        dangerouslySetInnerHTML={{
            __html: json({
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                itemListElement: items.map((it, i) => ({
                    "@type": "ListItem",
                    position: i + 1,
                    name: it.name,
                    item: it.url,
                })),
            }),
        }}
    />
);
