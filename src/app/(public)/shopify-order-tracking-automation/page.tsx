import type { Metadata } from "next";
import { GenericContentPage } from "../_components/content-page";
import { seoPages } from "../_lib/content";
import { marketingMetadata } from "../_lib/metadata";

export const metadata: Metadata = marketingMetadata({
    title: "Shopify Order Tracking Automation — Valyn",
    description:
        "Automate Shopify tracking email replies with order data, fulfillment status, and merchant-controlled templates.",
    path: "/shopify-order-tracking-automation",
});

const Page = () => (
    <GenericContentPage
        eyebrow="Shopify order tracking automation"
        title={seoPages.orderTracking.title}
        description={seoPages.orderTracking.description}
        sections={seoPages.orderTracking.sections}
    />
);

export default Page;
