import type { Metadata } from "next";
import { GenericContentPage } from "../_components/content-page";
import { seoPages } from "../_lib/content";
import { marketingMetadata } from "../_lib/metadata";

export const metadata: Metadata = marketingMetadata({
    title: "Reduce WISMO Tickets for Shopify Stores | Valyn",
    description:
        "Reduce repetitive WISMO tickets with automated Shopify order tracking replies.",
    path: "/reduce-wismo-tickets-shopify",
});

const Page = () => (
    <GenericContentPage
        eyebrow="Reduce WISMO tickets"
        title={seoPages.reduceWismo.title}
        description={seoPages.reduceWismo.description}
        sections={seoPages.reduceWismo.sections}
    />
);

export default Page;
