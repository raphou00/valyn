import type { Metadata } from "next";
import Link from "next/link";
import {
    checkItemClass,
    checkMarkClass,
    cn,
    Container,
    dashMarkClass,
    faqAnswerClass,
    faqDetailsClass,
    faqIconClass,
    faqSummaryClass,
    featuredPlanClass,
    featureTdClass,
    FinalCta,
    PageHead,
    planClass,
    PublicFooter,
    PublicHeader,
    Section,
    SectionHead,
    tableClass,
    tdClass,
    thClass,
} from "../_components/site-shell";
import { Check } from "../_components/icons";
import { INSTALL_HREF, marketingMetadata } from "../_lib/metadata";

export const metadata: Metadata = marketingMetadata({
    title: "Pricing — Valyn Shopify order support automation",
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
            { text: "Multiple reply templates, per language (EN/FR/DE)" },
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
    ["Reply templates", "1", "Multiple, per language"],
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
        a: "Auto-replies pause for the rest of the billing period and emails land in your dashboard log marked “Over quota”. Upgrade to resume sending — usage resets on the next renewal.",
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
    text === "✓" ? <span className={checkMarkClass}>✓</span>
    : text === "—" ? <span className={dashMarkClass}>—</span>
    : text;

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
                <div className="grid gap-5 lg:grid-cols-2">
                    {plans.map((plan) => (
                        <div
                            className={cn(
                                planClass,
                                plan.featured && featuredPlanClass
                            )}
                            key={plan.name}
                        >
                            {plan.featured && (
                                <span className="w-fit rounded-full bg-base-content px-3 py-1 text-xs font-medium uppercase tracking-[0.06em] text-base-100">
                                    Most popular
                                </span>
                            )}
                            <div>
                                <h3 className="text-3xl font-[330] text-base-content">
                                    {plan.name}
                                </h3>
                                <div className="mt-3 text-5xl font-[330] text-base-content">
                                    {plan.price}
                                    <span className="ml-1 text-base font-normal text-base-content/60">
                                        /month
                                    </span>
                                </div>
                                <p className="mt-2 text-base-content/70">
                                    {plan.desc}
                                </p>
                            </div>
                            <ul className="grid gap-3">
                                {plan.feats.map((f, i) => (
                                    <li className={checkItemClass} key={i}>
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
                                className="btn btn-primary mt-auto"
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
                        color: "var(--color-neutral)",
                        fontSize: 14,
                    }}
                >
                    Both plans billed monthly through Shopify. Switch tiers any
                    time from your Valyn dashboard.
                </p>
            </Container>
        </Section>

        <Section bg="soft">
            <Container>
                <SectionHead
                    eyebrow="Full comparison"
                    title="What's in each plan."
                />
                <table className={tableClass}>
                    <thead>
                        <tr>
                            <th className={cn(thClass, "w-[40%]")}>Feature</th>
                            <th className={thClass}>Starter</th>
                            <th className={cn(thClass, "bg-secondary")}>Pro</th>
                        </tr>
                    </thead>
                    <tbody>
                        {comparisonRows.map((row) => (
                            <tr key={row[0]}>
                                <td className={featureTdClass}>{row[0]}</td>
                                <td className={tdClass}>
                                    {renderCell(row[1])}
                                </td>
                                <td className={tdClass}>
                                    {renderCell(row[2])}
                                </td>
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
                <div className="grid gap-3">
                    {faqs.map((item) => (
                        <details
                            className={faqDetailsClass}
                            key={item.q}
                            open={item.open}
                        >
                            <summary className={faqSummaryClass}>
                                {item.q}
                                <span className={faqIconClass} />
                            </summary>
                            <div className={faqAnswerClass}>{item.a}</div>
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
