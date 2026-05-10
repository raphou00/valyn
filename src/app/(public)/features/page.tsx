import type { Metadata } from "next";
import {
    Container,
    DashboardMockup,
    FinalCta,
    PageHero,
    Section,
    SectionIntro,
} from "../_components/site-shell";
import { ListingGrid } from "../_components/content-page";
import { featureItems } from "../_lib/content";
import { marketingMetadata } from "../_lib/metadata";

export const metadata: Metadata = marketingMetadata({
    title: "Features - Valyn Shopify Order Support Automation",
    description:
        "Explore Valyn features for WISMO detection, Shopify order lookup, automatic replies, dashboard logs, and merchant settings.",
    path: "/features",
});

const Page = () => (
    <>
        <PageHero
            eyebrow="Features"
            title="Order support automation built for Shopify merchants."
            description="Valyn receives customer emails, detects repetitive order questions, finds Shopify order data, and replies with controlled templates."
        />
        <Section className="bg-base-200">
            <Container>
                <SectionIntro title="The core workflows." />
                <ListingGrid items={featureItems} />
            </Container>
        </Section>
        <Section className="bg-base-100">
            <Container>
                <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
                    <div>
                        <p className="text-sm font-semibold uppercase text-primary">
                            Dashboard
                        </p>
                        <h2 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">
                            Monitor automation without leaving Shopify.
                        </h2>
                        <p className="mt-4 text-lg text-slate-600">
                            The dashboard shows processed emails, automation
                            status, failed lookups, reply outcomes, and recent
                            support logs.
                        </p>
                    </div>
                    <DashboardMockup />
                </div>
            </Container>
        </Section>
        <Section className="bg-base-200">
            <Container>
                <SectionIntro title="Merchant settings stay explicit.">
                    <p>
                        Merchants can enable or pause automation, choose
                        language, customize greeting and signature, set reply
                        behavior, and verify SMTP settings.
                    </p>
                </SectionIntro>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                    {[
                        "Enable or disable automation",
                        "Language",
                        "Reply tone",
                        "Signature",
                        "Response delay",
                    ].map((setting) => (
                        <div
                            className="rounded-box border border-base-300 bg-base-100 p-5 text-center shadow-sm"
                            key={setting}
                        >
                            <p className="font-semibold text-slate-800">
                                {setting}
                            </p>
                        </div>
                    ))}
                </div>
            </Container>
        </Section>
        <FinalCta />
    </>
);

export default Page;
