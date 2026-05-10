import type { Metadata } from "next";
import { GenericContentPage } from "../_components/content-page";
import { comparisonPages } from "../_lib/content";
import { marketingMetadata } from "../_lib/metadata";

export const metadata: Metadata = marketingMetadata({
    title: "Simple Shopify Helpdesk Alternative for Order Support | Valyn",
    description:
        "Use Valyn when you need focused order-support automation rather than a full helpdesk system.",
    path: "/shopify-helpdesk-alternative",
});

const Page = () => (
    <GenericContentPage
        eyebrow="Comparison"
        title={comparisonPages.helpdesk.title}
        description={comparisonPages.helpdesk.description}
        sections={comparisonPages.helpdesk.sections}
    />
);

export default Page;
