import type { Metadata } from "next";
import {
    Container,
    DashboardMockup,
    FinalCta,
    PageHero,
    Section,
    SectionIntro,
} from "../_components/site-shell";
import { marketingMetadata } from "../_lib/metadata";

export const metadata: Metadata = marketingMetadata({
    title: "Demo - See Valyn Reply to a Shopify WISMO Email",
    description:
        "See how Valyn detects a Where is my order email, matches a Shopify order, generates a reply, and logs the result.",
    path: "/demo",
});

const demoSteps = [
    "Example customer email",
    "Detected intent",
    "Shopify order matched",
    "Automatic reply generated",
    "Merchant log created",
];

const Page = () => (
    <>
        <PageHero
            eyebrow="Demo"
            title="See how a repetitive tracking email becomes an automatic reply."
            description="This demo shows the product behavior without requiring installation."
        />
        <Section className="bg-base-200">
            <Container>
                <SectionIntro title="Demo flow" />
                <ul className="steps steps-vertical w-full lg:steps-horizontal">
                    {demoSteps.map((step) => (
                        <li className="step step-primary" key={step}>
                            {step}
                        </li>
                    ))}
                </ul>
            </Container>
        </Section>
        <Section className="bg-base-100">
            <Container>
                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
                        <div className="badge badge-info">Customer email</div>
                        <h2 className="mt-4 text-2xl font-bold text-slate-950">
                            Where is my order?
                        </h2>
                        <p className="mt-4 text-lg leading-8 text-slate-700">
                            Hi, I ordered last week and still have not received
                            my package. My order number is #1042.
                        </p>
                    </div>
                    <div className="rounded-box border border-base-300 bg-slate-950 p-6 text-white shadow-sm">
                        <div className="badge badge-success">
                            Generated reply
                        </div>
                        <h2 className="mt-4 text-2xl font-bold">Re: #1042</h2>
                        <p className="mt-4 text-lg leading-8 text-slate-200">
                            Hi Sarah, your order #1042 is currently in transit.
                            You can track it here: tracking link.
                        </p>
                    </div>
                </div>
            </Container>
        </Section>
        <Section className="bg-base-200">
            <Container>
                <SectionIntro title="The merchant sees a log entry, not a black box." />
                <DashboardMockup />
            </Container>
        </Section>
        <FinalCta />
    </>
);

export default Page;
