import type { Metadata } from "next";
import { GenericContentPage } from "../../_components/content-page";
import { featureSections } from "../../_lib/content";
import { marketingMetadata } from "../../_lib/metadata";

export const metadata: Metadata = marketingMetadata({
    title: "Shopify Order Tracking Automation | Valyn",
    description:
        "Automate Shopify order tracking emails with order lookup, fulfillment status, tracking links, and fallback behavior.",
    path: "/features/order-tracking-automation",
});

const Page = () => (
    <GenericContentPage
        eyebrow="Feature"
        title="Shopify order tracking automation"
        description="Reduce manual tracking replies by connecting incoming customer emails to Shopify order and fulfillment data."
        sections={featureSections.orderTracking}
    />
);

export default Page;
