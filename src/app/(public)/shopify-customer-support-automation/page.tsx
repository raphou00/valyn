import type { Metadata } from "next";
import { GenericContentPage } from "../_components/content-page";
import { seoPages } from "../_lib/content";
import { marketingMetadata } from "../_lib/metadata";

export const metadata: Metadata = marketingMetadata({
    title: "Shopify Customer Support Automation — Valyn",
    description:
        "Automate repetitive Shopify order support without adopting a broad helpdesk platform.",
    path: "/shopify-customer-support-automation",
});

const Page = () => (
    <GenericContentPage
        eyebrow="Shopify support automation"
        title={seoPages.customerSupport.title}
        description={seoPages.customerSupport.description}
        sections={seoPages.customerSupport.sections}
    />
);

export default Page;
