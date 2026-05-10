import type { Metadata } from "next";
import { GenericContentPage } from "../../_components/content-page";
import { featureSections } from "../../_lib/content";
import { marketingMetadata } from "../../_lib/metadata";

export const metadata: Metadata = marketingMetadata({
    title: "Customer Support Automation for Shopify Merchants | Valyn",
    description:
        "Automate repetitive Shopify customer support questions while keeping merchants in control of replies and settings.",
    path: "/features/customer-support-automation",
});

const Page = () => (
    <GenericContentPage
        eyebrow="Feature"
        title="Customer support automation for Shopify merchants"
        description="Valyn automates repetitive order questions without replacing the support team or turning the inbox into a generic chatbot."
        sections={featureSections.customerSupport}
    />
);

export default Page;
