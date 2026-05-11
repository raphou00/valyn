import type { Metadata } from "next";
import Link from "next/link";
import {
    Container,
    DashboardMockup,
    InstallPanel,
    PrimaryActions,
    PublicFooter,
    PublicHeader,
    Section,
    SectionHead,
} from "./_components/site-shell";
import EmailDemo from "./_components/email-demo";
import {
    Activity,
    AlertCircle,
    Check,
    Clock,
    Clipboard,
    Inbox,
    Mail,
    TrendUp,
} from "./_components/icons";
import { marketingMetadata } from "./_lib/metadata";

export const metadata: Metadata = marketingMetadata({
    title: 'Valyn — Automate "Where is my order?" support for Shopify',
    description:
        "Valyn detects customer emails about orders, finds the matching Shopify order, and replies automatically with accurate tracking information.",
    path: "/",
});

const trustStats = [
    { v: "< 5s", l: "Time-to-reply per email" },
    { v: "90%+", l: "WISMO detection accuracy" },
    { v: "3", l: "Languages — EN, FR, DE" },
    { v: "7 days", l: "Free trial, cancel anytime" },
];

const problems = [
    {
        icon: <AlertCircle />,
        title: "Same question, every single day",
        body: "Customers ask “where's my order?” before checking tracking links. Twice. Sometimes from a different inbox.",
    },
    {
        icon: <Clock />,
        title: "Delayed replies, frustrated buyers",
        body: "By the time you respond at 9am tomorrow, they've already left a ticket on three other channels.",
    },
    {
        icon: <TrendUp />,
        title: "Support workload scales with orders",
        body: "More sales = more inbox. Most of it isn't really support — it's a tracking link lookup.",
    },
];

const steps = [
    {
        n: 1,
        title: "Customer emails support",
        body: "“Where is my order?” lands in your inbox, forwarded to your Valyn address.",
    },
    {
        n: 2,
        title: "Valyn detects intent",
        body: "Keyword + sender match flags WISMO and ignores everything else.",
    },
    {
        n: 3,
        title: "Order lookup",
        body: "Matched by order number, sender email, or most-recent order — read-only.",
    },
    {
        n: 4,
        title: "Automatic reply",
        body: "Sent from your own SMTP, with carrier, tracking link, and ETA.",
    },
];

const features = [
    {
        icon: <Inbox />,
        title: "WISMO detection",
        body: "Keyword-based classifier in English, French, and German. Configurable strictness, low false-positive rate.",
    },
    {
        icon: <Clipboard />,
        title: "Shopify order lookup",
        body: "Matches by order number, sender email, or recent order history. Falls back gracefully when nothing fits.",
    },
    {
        icon: <Mail />,
        title: "Replies from your address",
        body: "Per-shop SMTP credentials. The customer sees your domain, your signature, your tone.",
    },
    {
        icon: <Activity />,
        title: "Live merchant dashboard",
        body: "Every email processed, logged, and reviewable. Pause, retry, or take over manually with one click.",
    },
];

const useCases = [
    {
        title: "Dropshipping stores",
        body: "Long shipping windows = inbox full of “where is it?”. Valyn replies with carrier, tracking link, and a realistic ETA — automatically.",
    },
    {
        title: "High-volume stores",
        body: "When 1% of orders generate an email, 10,000 orders generate a problem. Valyn handles the tracking floor; you handle the rest.",
    },
    {
        title: "Small teams, no helpdesk",
        body: "You don't need Gorgias. You need the one thing that eats 60% of your inbox to just stop. That's Valyn.",
    },
];

const securityCards = [
    {
        title: "Minimum Shopify scopes",
        body: "Only the read scopes required to look up orders and tracking. No write, no checkout, no customer modification.",
    },
    {
        title: "Encrypted credentials",
        body: "SMTP credentials are encrypted at rest with a per-deployment key. Tokens never leave the server.",
    },
    {
        title: "Full audit log",
        body: "Every reply, skipped email, and failed lookup is recorded with timestamps. Export any time.",
    },
    {
        title: "One-click pause",
        body: "Turn automation off instantly. Resume when you're ready — replies remain queued for review.",
    },
];

const homeFaq = [
    {
        q: "Does Valyn replace my helpdesk?",
        a: "No. Valyn handles repetitive order tracking emails — the ~60% of your inbox that's the same question. Real support stays with you, or with whatever helpdesk you already use.",
        open: true,
    },
    {
        q: "Does Valyn modify my Shopify store?",
        a: "Never. We request read-only access to orders, fulfillments, and customers. We never modify order data, never create customers, never touch checkout.",
    },
    {
        q: "What happens when Valyn can't find the order?",
        a: "Valyn falls back to a polite reply asking the customer for their order number, and flags the email in your dashboard for manual review. You can also configure it to never reply if it isn't confident.",
    },
    {
        q: "Does it work with non-English emails?",
        a: "Yes — English, French, and German out of the box. The detection model is language-aware, and replies are sent in the customer's language.",
    },
];

const plans = [
    {
        name: "Starter",
        price: "$19",
        desc: "For small stores getting started with automation.",
        feats: [
            "Up to 500 emails/month",
            "WISMO detection (English)",
            "Order lookup & auto-reply",
            "Basic email log (7-day retention)",
            "Standard email support",
        ],
        featured: false,
    },
    {
        name: "Pro",
        price: "$49",
        desc: "For growing stores handling larger support volume.",
        feats: [
            "Up to 3,000 emails/month",
            "Detection in EN, FR, DE",
            "Multiple templates & reply tone",
            "Advanced logs & retry (90 days)",
            "Manual review mode",
            "Priority email support",
        ],
        featured: true,
    },
];

const Page = () => (
    <>
        <PublicHeader />

        {/* Hero */}
        <section className="hero">
            <div className="wrap">
                <div className="hero-grid">
                    <div>
                        <span className="eyebrow">
                            <span className="dot" />
                            Shopify support automation
                        </span>
                        <h1 style={{ marginTop: 22 }}>
                            Automate{" "}
                            <span className="accent">
                                &ldquo;Where is my order?&rdquo;
                            </span>{" "}
                            support for Shopify.
                        </h1>
                        <p className="lede" style={{ marginTop: 24 }}>
                            Valyn detects customer emails about orders, finds
                            the matching Shopify order, and replies
                            automatically with accurate tracking information —
                            in under 5 seconds.
                        </p>
                        <PrimaryActions />
                        <div className="hero-trust">
                            <span>
                                <Check />
                                7-day free trial
                            </span>
                            <span>
                                <Check />
                                Installs in under 2 minutes
                            </span>
                            <span>
                                <Check />
                                Read-only Shopify access
                            </span>
                        </div>
                    </div>
                    <EmailDemo />
                </div>
            </div>
        </section>

        {/* Trust strip */}
        <section className="bg-soft" style={{ padding: "32px 0" }}>
            <Container>
                <div
                    className="stat-strip"
                    style={{
                        background: "#fff",
                        borderRadius: "var(--radius-lg)",
                        border: "1px solid var(--line)",
                        margin: 0,
                    }}
                >
                    {trustStats.map((s) => (
                        <div className="item" key={s.l}>
                            <div className="v">{s.v}</div>
                            <div className="l">{s.l}</div>
                        </div>
                    ))}
                </div>
            </Container>
        </section>

        {/* Problem */}
        <Section>
            <Container>
                <div className="feat-row" style={{ alignItems: "flex-start" }}>
                    <div>
                        <span className="kicker">The problem</span>
                        <h2 style={{ marginTop: 16 }}>
                            Your support inbox shouldn&apos;t be full of
                            tracking questions.
                        </h2>
                        <p className="lede" style={{ marginTop: 20 }}>
                            Every Shopify merchant has the same conversation, 40
                            times a week. The same question, the same tracking
                            link, the same polite reply. It&apos;s repetitive,
                            it&apos;s slow, and it scales linearly with orders.
                        </p>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 14,
                        }}
                    >
                        {problems.map((p) => (
                            <div
                                className="card"
                                key={p.title}
                                style={{
                                    padding: 22,
                                    display: "flex",
                                    gap: 16,
                                    alignItems: "flex-start",
                                }}
                            >
                                <div
                                    className="ico-box"
                                    style={{
                                        margin: 0,
                                        flexShrink: 0,
                                        background: "#fef4d1",
                                        color: "#8a5a08",
                                    }}
                                >
                                    {p.icon}
                                </div>
                                <div>
                                    <h4 style={{ marginBottom: 4 }}>
                                        {p.title}
                                    </h4>
                                    <p
                                        style={{
                                            color: "var(--muted)",
                                            fontSize: 14,
                                        }}
                                    >
                                        {p.body}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Container>
        </Section>

        {/* How it works */}
        <Section bg="soft">
            <Container>
                <SectionHead
                    eyebrow="How it works"
                    title="Valyn handles repetitive order support automatically."
                    description="Four steps, no rules engine to configure, no helpdesk to migrate to."
                />
                <div className="steps">
                    {steps.map((s) => (
                        <div className="step active" key={s.n}>
                            <div className="num">{s.n}</div>
                            <h4>{s.title}</h4>
                            <p>{s.body}</p>
                        </div>
                    ))}
                </div>
            </Container>
        </Section>

        {/* Features */}
        <Section>
            <Container>
                <SectionHead
                    eyebrow="Features"
                    title="Built for one job. Built well."
                    description="No AI hype, no helpdesk bloat. Just the smallest tool that solves WISMO end-to-end."
                />
                <div className="grid-4">
                    {features.map((f) => (
                        <div className="card" key={f.title}>
                            <div className="ico-box">{f.icon}</div>
                            <h3>{f.title}</h3>
                            <p>{f.body}</p>
                        </div>
                    ))}
                </div>
            </Container>
        </Section>

        {/* Dashboard preview */}
        <Section bg="warm">
            <Container>
                <SectionHead
                    eyebrow="Embedded admin"
                    title="You stay in control. Always."
                    description="The Valyn dashboard lives inside your Shopify admin. Every reply is logged. Every automation is reviewable."
                />
                <DashboardMockup />
            </Container>
        </Section>

        {/* Use cases */}
        <Section>
            <Container>
                <SectionHead
                    eyebrow="Who it's for"
                    title="Made for Shopify merchants who'd rather be doing anything else."
                />
                <div className="grid-3">
                    {useCases.map((u) => (
                        <div className="card" key={u.title}>
                            <h3>{u.title}</h3>
                            <p>{u.body}</p>
                        </div>
                    ))}
                </div>
            </Container>
        </Section>

        {/* Pricing teaser */}
        <Section bg="soft">
            <Container>
                <SectionHead
                    eyebrow="Pricing"
                    title="Honest pricing. 7-day trial."
                    description="Two plans. Pick the one that fits your inbox volume. 7-day free trial on both."
                />
                <div className="pricing-grid">
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
                            </div>
                            <p className="desc">{plan.desc}</p>
                            <ul>
                                {plan.feats.map((f) => (
                                    <li key={f}>
                                        <Check />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <Link
                                href="/pricing"
                                className={
                                    plan.featured ? "btn btn-green" : (
                                        "btn btn-ghost"
                                    )
                                }
                            >
                                Choose {plan.name}
                            </Link>
                        </div>
                    ))}
                </div>
            </Container>
        </Section>

        {/* Security */}
        <Section>
            <Container>
                <div
                    className="feat-row"
                    style={{
                        gridTemplateColumns: "1fr 1.4fr",
                        alignItems: "flex-start",
                    }}
                >
                    <div>
                        <span className="kicker">Trust & security</span>
                        <h2 style={{ marginTop: 16 }}>
                            Designed with merchant trust in mind.
                        </h2>
                        <p className="lede" style={{ marginTop: 20 }}>
                            We ask Shopify for the minimum permissions needed
                            and nothing more. Valyn never modifies your store —
                            it reads order data so it can reply accurately.
                        </p>
                        <div className="tag-row" style={{ marginTop: 24 }}>
                            <span className="tag">
                                <span className="dot" />
                                Read-only order access
                            </span>
                            <span className="tag">
                                <span className="dot" />
                                GDPR ready
                            </span>
                            <span className="tag">
                                <span className="dot" />
                                SES & AWS hosted
                            </span>
                            <span className="tag">
                                <span className="dot" />
                                Encrypted SMTP creds
                            </span>
                        </div>
                    </div>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: 14,
                        }}
                    >
                        {securityCards.map((c) => (
                            <div className="card" key={c.title}>
                                <h4>{c.title}</h4>
                                <p style={{ marginTop: 8 }}>{c.body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </Container>
        </Section>

        {/* FAQ teaser */}
        <Section bg="soft">
            <Container narrow>
                <SectionHead
                    eyebrow="Common questions"
                    title="The short version."
                />
                <div className="faq">
                    {homeFaq.map((item) => (
                        <details key={item.q} open={item.open}>
                            <summary>
                                {item.q}
                                <span className="ico" />
                            </summary>
                            <div className="answer">{item.a}</div>
                        </details>
                    ))}
                </div>
                <div style={{ textAlign: "center", marginTop: 36 }}>
                    <Link href="/faq" className="btn btn-ghost">
                        All questions →
                    </Link>
                </div>
            </Container>
        </Section>

        <InstallPanel />

        <PublicFooter />
    </>
);

export default Page;
