import type { Metadata } from "next";
import { GenericContentPage } from "../../_components/content-page";
import { legalSections } from "../../_lib/content";
import { marketingMetadata } from "../../_lib/metadata";

const page = legalSections.privacy;

export const metadata: Metadata = marketingMetadata({
    title: "Privacy Policy - Valyn",
    description: page.description,
    path: "/legal/privacy",
});

const Page = () => (
    <GenericContentPage
        eyebrow="Last updated: May 10, 2026"
        title={page.title}
        description={page.description}
        sections={page.sections}
    />
);

export default Page;
