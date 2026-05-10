import type { Metadata } from "next";
import Link from "next/link";
import {
    Container,
    FinalCta,
    PageHero,
    Section,
    SectionIntro,
} from "../_components/site-shell";
import { marketingMetadata } from "../_lib/metadata";

export const metadata: Metadata = marketingMetadata({
    title: "Pricing - Valyn Shopify Order Support Automation",
    description:
        "Simple Valyn pricing for Shopify merchants. Includes a 14-day free trial, no setup call, and cancel anytime billing through Shopify.",
    path: "/pricing",
});

const included = [
    "WISMO automation",
    "Email processing",
    "Shopify order lookup",
    "Reply templates",
    "Multi-language replies",
    "Dashboard logs",
    "SMTP sending through your own provider",
];

const Page = () => (
    <>
        <PageHero
            eyebrow="Pricing"
            title="Simple pricing for focused order support automation."
            description="Start with the launch plan, test it during the free trial, and cancel anytime from Shopify."
        />
        <Section className="bg-base-200">
            <Container>
                <SectionIntro title="One launch plan. No setup call required." />
                <div className="mx-auto max-w-2xl">
                    <div className="card border-2 border-primary bg-base-100 shadow-xl">
                        <div className="card-body">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                    <div className="badge badge-primary">
                                        14-day free trial
                                    </div>
                                    <h2 className="mt-4 text-3xl font-bold text-slate-950">
                                        Pro
                                    </h2>
                                    <p className="mt-2 text-slate-600">
                                        For Shopify stores that want to reduce
                                        repetitive tracking emails.
                                    </p>
                                </div>
                                <div className="text-left sm:text-right">
                                    <p className="text-4xl font-bold text-slate-950">
                                        $19
                                    </p>
                                    <p className="text-sm text-slate-500">
                                        per month
                                    </p>
                                </div>
                            </div>
                            <div className="divider" />
                            <ul className="grid gap-3">
                                {included.map((item) => (
                                    <li
                                        className="flex items-center gap-3"
                                        key={item}
                                    >
                                        <span className="badge badge-success badge-sm" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="card-actions mt-6">
                                <Link
                                    className="btn btn-primary btn-block"
                                    href="/#install"
                                >
                                    Install on Shopify
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </Section>
        <Section className="bg-base-100">
            <Container>
                <div className="grid gap-4 md:grid-cols-3">
                    {[
                        "Free trial included",
                        "No setup call required",
                        "Cancel anytime",
                    ].map((note) => (
                        <div
                            className="rounded-box border border-base-300 bg-base-100 p-6 text-center shadow-sm"
                            key={note}
                        >
                            <p className="font-semibold text-slate-800">
                                {note}
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
