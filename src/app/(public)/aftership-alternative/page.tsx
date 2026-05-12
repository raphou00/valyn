import type { Metadata } from "next";
import { GenericContentPage } from "../_components/content-page";
import { comparisonPages } from "../_lib/content";
import { marketingMetadata } from "../_lib/metadata";

export const metadata: Metadata = marketingMetadata({
    title: "Focused AfterShip Alternative for Shopify Support Automation — Valyn",
    description:
        "Valyn focuses on automated support replies for Shopify order questions, not only tracking pages.",
    path: "/aftership-alternative",
});

const Page = () => (
    <GenericContentPage
        eyebrow="Comparison"
        title={comparisonPages.aftership.title}
        description={comparisonPages.aftership.description}
        sections={comparisonPages.aftership.sections}
    />
);

export default Page;
