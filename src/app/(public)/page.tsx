import type { Metadata } from "next";
import {
    Container,
    DashboardMockup,
    FeatureCard,
    FinalCta,
    PageHero,
    Section,
    SectionIntro,
} from "./_components/site-shell";
import { marketingMetadata } from "./_lib/metadata";

export const metadata: Metadata = marketingMetadata({
    title: "Valyn - Shopify Order Support Automation",
    description:
        "Valyn helps Shopify merchants automate repetitive order support emails, including Where is my order requests.",
    path: "/",
});

const problemPoints = [
    "Customers ask Where is my order every day.",
    "Tracking questions create repetitive support work.",
    "Delayed replies increase customer frustration.",
    "Support workload grows with order volume.",
];

const highlights = [
    {
        title: "WISMO detection",
        body: "Detects order tracking questions from customer emails.",
    },
    {
        title: "Shopify order lookup",
        body: "Finds the correct order using email, order number, and recent order history.",
    },
    {
        title: "Automatic replies",
        body: "Sends clear customer replies using merchant-approved templates.",
    },
    {
        title: "Merchant control",
        body: "Enable, pause, retry, or review automation from the dashboard.",
    },
];

const Page = () => {
    return (
        <>
            <PageHero
                description="Valyn replies to repetitive order tracking emails automatically, so merchants spend less time answering the same support questions."
                title="Automate Where is my order support for Shopify."
            >
                <p className="mt-6 max-w-xl text-sm font-medium text-slate-500">
                    Built for Shopify merchants. Secure, simple, and focused on
                    order support.
                </p>
            </PageHero>

            <Section className="bg-base-200">
                <Container>
                    <SectionIntro title="Your support inbox should not be full of tracking questions." />
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {problemPoints.map((point) => (
                            <div
                                className="rounded-box border border-base-300 bg-base-100 p-5 shadow-sm"
                                key={point}
                            >
                                <p className="font-semibold text-slate-800">
                                    {point}
                                </p>
                            </div>
                        ))}
                    </div>
                </Container>
            </Section>

            <Section className="bg-base-100">
                <Container>
                    <SectionIntro title="Valyn handles repetitive order support automatically.">
                        <p>
                            A focused workflow for emails that can be answered
                            from Shopify order data.
                        </p>
                    </SectionIntro>
                    <ul className="steps steps-vertical w-full lg:steps-horizontal">
                        <li className="step step-primary">
                            Customer sends an order-related email
                        </li>
                        <li className="step step-primary">
                            Valyn detects the request
                        </li>
                        <li className="step step-primary">
                            Valyn finds the matching Shopify order
                        </li>
                        <li className="step step-primary">
                            Valyn replies with status and tracking
                        </li>
                    </ul>
                </Container>
            </Section>

            <Section className="bg-base-200">
                <Container>
                    <SectionIntro title="Focused features for order support." />
                    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                        {highlights.map((item) => (
                            <FeatureCard title={item.title} key={item.title}>
                                <p>{item.body}</p>
                            </FeatureCard>
                        ))}
                    </div>
                </Container>
            </Section>

            <Section className="bg-base-100">
                <Container>
                    <SectionIntro
                        eyebrow="Dashboard preview"
                        title="See what was processed, replied to, and escalated."
                    />
                    <DashboardMockup />
                </Container>
            </Section>

            <Section className="bg-base-200">
                <Container>
                    <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
                        <div>
                            <p className="text-sm font-semibold uppercase text-primary">
                                Use cases
                            </p>
                            <h2 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">
                                Built for merchants who keep seeing the same
                                tracking questions.
                            </h2>
                        </div>
                        <div className="grid gap-3">
                            {[
                                "Dropshipping stores",
                                "High-volume Shopify stores",
                                "Small teams without dedicated support staff",
                                "Stores receiving repeated tracking emails",
                            ].map((item) => (
                                <div
                                    className="alert border border-base-300 bg-base-100"
                                    key={item}
                                >
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </Container>
            </Section>

            <Section className="bg-base-100">
                <Container>
                    <SectionIntro title="Reduce repetitive tickets without adding helpdesk complexity." />
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                        {[
                            "Reduce repetitive support tickets",
                            "Save merchant time",
                            "Improve response speed",
                            "Keep customers informed",
                            "Avoid unnecessary helpdesk complexity",
                        ].map((benefit) => (
                            <div
                                className="rounded-box border border-base-300 bg-base-100 p-5 text-center shadow-sm"
                                key={benefit}
                            >
                                <p className="font-semibold text-slate-800">
                                    {benefit}
                                </p>
                            </div>
                        ))}
                    </div>
                </Container>
            </Section>

            <Section className="bg-base-200">
                <Container>
                    <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
                        <div>
                            <p className="text-sm font-semibold uppercase text-primary">
                                Security
                            </p>
                            <h2 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">
                                Designed with merchant trust in mind.
                            </h2>
                            <p className="mt-4 text-lg text-slate-600">
                                Valyn is built around limited access, clear
                                logs, and merchant-controlled automation.
                            </p>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            {[
                                "Uses only required Shopify permissions",
                                "Read-focused order access",
                                "Secure token storage",
                                "Merchant-controlled automation",
                                "Logs every automated reply",
                            ].map((point) => (
                                <FeatureCard title={point} key={point}>
                                    <p>
                                        Focused controls for order-support
                                        automation rather than broad
                                        customer-data access.
                                    </p>
                                </FeatureCard>
                            ))}
                        </div>
                    </div>
                </Container>
            </Section>

            <FinalCta />
        </>
    );
};

export default Page;
