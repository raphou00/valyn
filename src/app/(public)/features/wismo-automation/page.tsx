import type { Metadata } from "next";
import { GenericContentPage } from "../../_components/content-page";
import { featureSections } from "../../_lib/content";
import { marketingMetadata } from "../../_lib/metadata";

export const metadata: Metadata = marketingMetadata({
    title: "Reduce WISMO Tickets for Shopify Stores — Valyn",
    description:
        "Reduce repetitive WISMO tickets with automated Shopify order tracking replies and merchant-controlled fallback behavior.",
    path: "/features/wismo-automation",
});

const Page = () => (
    <GenericContentPage
        eyebrow="Feature"
        title="Reduce WISMO tickets for your Shopify store"
        description="WISMO means Where is my order. Valyn helps merchants answer those repetitive questions automatically."
        sections={featureSections.wismo}
    />
);

export default Page;
