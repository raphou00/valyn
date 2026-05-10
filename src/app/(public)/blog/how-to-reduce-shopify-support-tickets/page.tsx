import type { Metadata } from "next";
import { GenericContentPage } from "../../_components/content-page";
import { blogPosts } from "../../_lib/content";
import { marketingMetadata } from "../../_lib/metadata";

const post = blogPosts[1];

export const metadata: Metadata = marketingMetadata({
    title: "How to Reduce Shopify Support Tickets | Valyn",
    description: post.description,
    path: post.href,
    type: "article",
});

const Page = () => (
    <GenericContentPage
        eyebrow={post.date}
        title={post.title}
        description={post.description}
        sections={post.sections}
    />
);

export default Page;
