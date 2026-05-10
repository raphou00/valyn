import type { Metadata } from "next";
import {
    Container,
    FinalCta,
    PageHero,
    Section,
} from "../_components/site-shell";
import { FaqList } from "../_components/content-page";
import { faqItems } from "../_lib/content";
import { marketingMetadata } from "../_lib/metadata";

export const metadata: Metadata = marketingMetadata({
    title: "FAQ - Valyn Shopify Order Support Automation",
    description:
        "Answers about Valyn, WISMO automation, Shopify order access, helpdesk fit, languages, and customer data security.",
    path: "/faq",
});

const Page = () => (
    <>
        <PageHero
            eyebrow="FAQ"
            title="Questions merchants ask before automating order support."
            description="Clear answers about what Valyn does, what it does not do, and how the automation stays controlled."
        />
        <Section className="bg-base-200">
            <Container>
                <FaqList items={faqItems} />
            </Container>
        </Section>
        <FinalCta />
    </>
);

export default Page;
