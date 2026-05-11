import type { Metadata } from "next";
import Link from "next/link";
import {
    Container,
    FinalCta,
    PageHead,
    PublicFooter,
    PublicHeader,
    Section,
    SectionHead,
} from "../_components/site-shell";
import { Check } from "../_components/icons";
import { INSTALL_HREF, marketingMetadata } from "../_lib/metadata";

export const metadata: Metadata = marketingMetadata({
    title: "Pricing — Valyn",
    description:
        "Two plans for Valyn — Starter $19/mo and Pro $49/mo. 7-day free trial, cancel anytime.",
    path: "/pricing",
});

type Plan = {
    name: string;
    price: string;
    desc: string;
    feats: { text: string; emphasis?: string }[];
    featured?: boolean;
};

const plans: Plan[] = [
    {
        name: "Starter",
        price: "$19",
        desc: "For small stores getting started with automation.",
        feats: [
            { emphasis: "Up to 500", text: "processed emails/month" },
            { text: "WISMO detection (English only)" },
            { text: "Shopify order lookup & auto-reply" },
            { text: "Order matching by email or order number" },
            { text: "Fallback reply when order is not found" },
            { text: "1 reply template + basic signature" },
            { text: "Email processing logs (7 days retention)" },
            { text: "Standard email support" },
        ],
    },
    {
        name: "Pro",
        price: "$49",
        desc: "For growing stores handling larger support volume.",
        feats: [
            { emphasis: "Up to 3,000", text: "processed emails/month" },
            { text: "WISMO detection in EN, FR, DE" },
            { text: "Multiple reply templates" },
            { text: "Reply tone control (friendly / neutral / formal)" },
            { text: "Custom signatures" },
            { text: "Email processing logs (90 days retention)" },
            { text: "One-click retry for failed replies" },
            { text: "Pause automation & manual review mode" },
            { text: "Priority email support" },
        ],
        featured: true,
    },
];

const comparisonRows: [string, string, string][] = [
    ["Processed emails / month", "500", "3,000"],
    ["WISMO detection", "✓", "✓"],
    ["Shopify order lookup", "✓", "✓"],
    ["Languages", "EN", "EN, FR, DE"],
    ["Reply templates", "1", "Multiple"],
    ["Reply tone control", "—", "✓"],
    ["Custom signature", "Basic", "Custom"],
    ["Log retention", "7 days", "90 days"],
    ["One-click retry", "—", "✓"],
    ["Manual review mode", "—", "✓"],
    ["Pause automation", "✓", "✓"],
    ["Support", "Email", "Priority email"],
];

const faqs = [
    {
        q: "What counts as a “processed email”?",
        a: "Every email Valyn receives counts as one — whether it's classified as WISMO, marked as non-WISMO, or sent back for manual review. Replies don't count separately. Notifications you receive from Shopify itself don't count.",
        open: true,
    },
    {
        q: "What happens if I exceed my plan limit?",
        a: "Nothing breaks. We'll notify you in the dashboard so you can upgrade or wait for the next billing cycle. Overage isn't silently throttled.",
    },
    {
        q: "Is there a free plan?",
        a: "Every plan comes with a 7-day free trial. We don't offer a perpetual free tier — running inbound mail infrastructure costs money, and we'd rather charge fairly than nickel-and-dime you with usage limits.",
    },
    {
        q: "How do I cancel?",
        a: "Uninstall Valyn from your Shopify admin. Billing stops immediately. Your data is retained for 30 days in case you want to come back, then permanently deleted.",
    },
    {
        q: "Can I switch between plans?",
        a: "Yes — upgrade or downgrade any time from the embedded billing panel. Pro-rated through Shopify.",
    },
];

const renderCell = (text: string) =>
    text === "✓" ?
        <span className="check">✓</span>
    : text === "—" ?
        <span className="dash">—</span>
    :   text;

const Page = () => (
    <>
        <PublicHeader active="pricing" />

        <PageHead
            eyebrow="Pricing"
            title={
                <>
                    One job, done well.
                    <br />
                    Two plans, no surprises.
                </>
            }
            description="7-day free trial on every plan. No credit card required to install. Cancel anytime from your Shopify admin."
        />

        <Section style={{ paddingTop: 48 }}>
            <Container>
                <div
                    className="pricing-grid"
                    style={{
                        gridTemplateColumns: "repeat(2, 1fr)",
                        maxWidth: 880,
                        margin: "0 auto",
                    }}
                >
                    {plans.map((plan) => (
                        <div
                            className={`plan${plan.featured ? " featured" : ""}`}
                            key={plan.name}
                        >
                            {plan.featured && (
                                <span className="badge">Most popular</span>
                            )}
                            <div>
                                <h3>{plan.name}</h3>
                                <div className="price" style={{ marginTop: 8 }}>
                                    {plan.price}
                                    <span>/month</span>
                                </div>
                                <p className="desc" style={{ marginTop: 8 }}>
                                    {plan.desc}
                                </p>
                            </div>
                            <ul>
                                {plan.feats.map((f, i) => (
                                    <li key={i}>
                                        <Check />
                                        <div>
                                            {f.emphasis && (
                                                <strong>{f.emphasis} </strong>
                                            )}
                                            {f.text}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <Link
                                href={INSTALL_HREF}
                                className={
                                    plan.featured ?
                                        "btn btn-green"
                                    :   "btn btn-ghost"
                                }
                            >
                                Start free trial
                            </Link>
                        </div>
                    ))}
                </div>
                <p
                    style={{
                        textAlign: "center",
                        marginTop: 32,
                        color: "var(--muted)",
                        fontSize: 14,
                    }}
                >
                    Both plans billed monthly through Shopify. Switch tiers
                    any time from your Valyn dashboard.
                </p>
            </Container>
        </Section>

        <Section bg="soft">
            <Container>
                <SectionHead
                    eyebrow="Full comparison"
                    title="What's in each plan."
                />
                <table className="compare-table">
                    <thead>
                        <tr>
                            <th style={{ width: "40%" }}>Feature</th>
                            <th>Starter</th>
                            <th className="col-us">Pro</th>
                        </tr>
                    </thead>
                    <tbody>
                        {comparisonRows.map((row) => (
                            <tr key={row[0]}>
                                <td className="feature">{row[0]}</td>
                                <td>{renderCell(row[1])}</td>
                                <td>{renderCell(row[2])}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Container>
        </Section>

        <Section>
            <Container narrow>
                <SectionHead
                    eyebrow="Pricing questions"
                    title="Honest answers."
                />
                <div className="faq">
                    {faqs.map((item) => (
                        <details key={item.q} open={item.open}>
                            <summary>
                                {item.q}
                                <span className="ico" />
                            </summary>
                            <div className="answer">{item.a}</div>
                        </details>
                    ))}
                </div>
            </Container>
        </Section>

        <FinalCta
            title="7 days, no card, no commitment."
            description="Install Valyn, forward one email, see it work. If it doesn't fit, uninstall and you owe nothing."
            primaryLabel="Install on Shopify"
            secondaryHref="/demo"
            secondaryLabel="View demo first"
        />

        <PublicFooter />
    </>
);

export default Page;
