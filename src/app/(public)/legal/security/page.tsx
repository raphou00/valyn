import type { Metadata } from "next";
import { GenericContentPage } from "../../_components/content-page";
import { legalSections } from "../../_lib/content";
import { marketingMetadata } from "../../_lib/metadata";

const page = legalSections.security;

export const metadata: Metadata = marketingMetadata({
    title: "Security - Valyn",
    description: page.description,
    path: "/legal/security",
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
