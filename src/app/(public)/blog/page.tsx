import type { Metadata } from "next";
import {
    Container,
    FinalCta,
    PageHead,
    PublicFooter,
    PublicHeader,
    Section,
    SectionHead,
} from "../_components/site-shell";
import { ListingGrid } from "../_components/content-page";
import { blogPosts } from "../_lib/content";
import { marketingMetadata } from "../_lib/metadata";

export const metadata: Metadata = marketingMetadata({
    title: "Valyn Blog — Shopify support automation guides",
    description:
        "Guides on WISMO, Shopify support automation, order tracking emails, and customer support app selection.",
    path: "/blog",
    type: "article",
});

const Page = () => (
    <>
        <PublicHeader />
        <PageHead
            eyebrow="Blog"
            title="Practical guides for reducing Shopify support workload."
            description="Learn how to reduce repetitive tickets, improve tracking communication, and automate order-support emails carefully."
        />
        <Section bg="soft">
            <Container>
                <SectionHead title="Latest articles" />
                <ListingGrid items={blogPosts} />
            </Container>
        </Section>
        <FinalCta />
        <PublicFooter />
    </>
);

export default Page;
