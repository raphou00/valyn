import type { Metadata } from "next";
import Link from "next/link";
import {
    cardClass,
    checkItemClass,
    cn,
    Container,
    DashboardMockup,
    faqAnswerClass,
    faqDetailsClass,
    faqIconClass,
    faqSummaryClass,
    featuredPlanClass,
    iconBoxClass,
    InstallPanel,
    planClass,
    PrimaryActions,
    PublicFooter,
    PublicHeader,
    Section,
    SectionHead,
    warningIconBoxClass,
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
        <section className="relative overflow-hidden bg-gradient-to-b from-base-200 to-base-100 py-16 sm:py-20 lg:py-28">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="relative grid items-center gap-10 lg:grid-cols-[1fr_520px]">
                    <div>
                        <span className="inline-flex items-center gap-2 rounded-full border border-base-300 bg-base-200 px-3 py-1.5 text-xs font-semibold uppercase tracking-normal text-base-content/70">
                            <span className="size-1.5 rounded-full bg-primary shadow-[0_0_0_4px_color-mix(in_srgb,var(--color-primary)_18%,transparent)]" />
                            Shopify support automation
                        </span>
                        <h1 className="mt-5 text-4xl font-semibold leading-tight text-base-content sm:text-5xl lg:text-6xl">
                            Automate{" "}
                            <span className="text-primary">
                                &ldquo;Where is my order?&rdquo;
                            </span>{" "}
                            support for Shopify.
                        </h1>
                        <p className="mt-6 max-w-2xl text-lg leading-8 text-base-content/70 sm:text-xl">
                            Valyn detects customer emails about orders, finds
                            the matching Shopify order, and replies
                            automatically with accurate tracking information —
                            in under 5 seconds.
                        </p>
                        <PrimaryActions />
                        <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-base-content/70">
                            <span className="inline-flex items-center gap-1.5">
                                <Check className="size-4 text-primary" />
                                7-day free trial
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <Check className="size-4 text-primary" />
                                Installs in under 2 minutes
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <Check className="size-4 text-primary" />
                                Read-only Shopify access
                            </span>
                        </div>
                    </div>
                    <EmailDemo />
                </div>
            </div>
        </section>

        {/* Trust strip */}
        <section className="bg-base-200 py-8">
            <Container>
                <div className="grid overflow-hidden rounded-box border border-base-300 bg-base-100 sm:grid-cols-2 lg:grid-cols-4">
                    {trustStats.map((s) => (
                        <div
                            className="border-b border-base-300 p-5 last:border-b-0 sm:border-r sm:last:border-r-0 lg:border-b-0"
                            key={s.l}
                        >
                            <div className="text-2xl font-semibold text-base-content">
                                {s.v}
                            </div>
                            <div className="mt-1 text-sm text-base-content/70">
                                {s.l}
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </section>

        {/* Problem */}
        <Section>
            <Container>
                <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
                    <div>
                        <span className="text-xs font-semibold uppercase tracking-normal text-base-content/70">The problem</span>
                        <h2 className="mt-4 text-3xl font-semibold leading-tight text-base-content sm:text-4xl lg:text-5xl">
                            Your support inbox shouldn&apos;t be full of
                            tracking questions.
                        </h2>
                        <p className="mt-5 max-w-2xl text-lg leading-8 text-base-content/70 sm:text-xl">
                            Every Shopify merchant has the same conversation, 40
                            times a week. The same question, the same tracking
                            link, the same polite reply. It&apos;s repetitive,
                            it&apos;s slow, and it scales linearly with orders.
                        </p>
                    </div>
                    <div className="grid gap-3.5">
                        {problems.map((p) => (
                            <div
                                className="flex items-start gap-4 rounded-box border border-base-300 bg-base-100 p-5 shadow-sm"
                                key={p.title}
                            >
                                <div className={warningIconBoxClass}>
                                    {p.icon}
                                </div>
                                <div>
                                    <h4 className="mb-1 font-semibold text-base-content">
                                        {p.title}
                                    </h4>
                                    <p className="text-sm leading-6 text-base-content/70">
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
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                    {steps.map((s) => (
                        <div
                            className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm"
                            key={s.n}
                        >
                            <div className="mb-4 inline-flex size-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-content">
                                {s.n}
                            </div>
                            <h4 className="font-semibold text-base-content">
                                {s.title}
                            </h4>
                            <p className="mt-2 text-sm leading-6 text-base-content/70">
                                {s.body}
                            </p>
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
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {features.map((f) => (
                        <div className={cardClass} key={f.title}>
                            <div className={iconBoxClass}>{f.icon}</div>
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
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {useCases.map((u) => (
                        <div className={cardClass} key={u.title}>
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
                                <span className="w-fit rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-content">
                                    Most popular
                                </span>
                            )}
                            <div>
                                <h3 className="text-2xl font-semibold text-base-content">
                                    {plan.name}
                                </h3>
                                <div className="mt-2 text-4xl font-semibold text-base-content">
                                    {plan.price}
                                    <span className="ml-1 text-base font-normal text-base-content/60">
                                        /month
                                    </span>
                                </div>
                            </div>
                            <p className="text-base-content/70">{plan.desc}</p>
                            <ul className="grid gap-3">
                                {plan.feats.map((f) => (
                                    <li className={checkItemClass} key={f}>
                                        <Check />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <Link
                                href="/pricing"
                                className={
                                    plan.featured ? "btn btn-primary" : (
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
                    className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:items-start"
                >
                    <div>
                        <span className="text-xs font-semibold uppercase tracking-normal text-base-content/70">Trust & security</span>
                        <h2 className="mt-4 text-3xl font-semibold leading-tight text-base-content sm:text-4xl lg:text-5xl">
                            Designed with merchant trust in mind.
                        </h2>
                        <p className="mt-5 max-w-2xl text-lg leading-8 text-base-content/70 sm:text-xl">
                            We ask Shopify for the minimum permissions needed
                            and nothing more. Valyn never modifies your store —
                            it reads order data so it can reply accurately.
                        </p>
                        <div className="mt-6 flex flex-wrap gap-2">
                            <span className="inline-flex items-center gap-2 rounded-full border border-base-300 bg-base-100 px-3 py-1.5 text-sm text-base-content/70">
                                <span className="size-1.5 rounded-full bg-primary" />
                                Read-only order access
                            </span>
                            <span className="inline-flex items-center gap-2 rounded-full border border-base-300 bg-base-100 px-3 py-1.5 text-sm text-base-content/70">
                                <span className="size-1.5 rounded-full bg-primary" />
                                GDPR ready
                            </span>
                            <span className="inline-flex items-center gap-2 rounded-full border border-base-300 bg-base-100 px-3 py-1.5 text-sm text-base-content/70">
                                <span className="size-1.5 rounded-full bg-primary" />
                                SES & AWS hosted
                            </span>
                            <span className="inline-flex items-center gap-2 rounded-full border border-base-300 bg-base-100 px-3 py-1.5 text-sm text-base-content/70">
                                <span className="size-1.5 rounded-full bg-primary" />
                                Encrypted SMTP creds
                            </span>
                        </div>
                    </div>
                    <div className="grid gap-3.5 sm:grid-cols-2">
                        {securityCards.map((c) => (
                            <div className={cardClass} key={c.title}>
                                <h4>{c.title}</h4>
                                <p>{c.body}</p>
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
                <div className="grid gap-3">
                    {homeFaq.map((item) => (
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
                <div className="mt-9 text-center">
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
