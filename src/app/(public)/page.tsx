import type { Metadata } from "next";
import Image from "next/image";
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
    planClass,
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
    ShopifyBox,
} from "./_components/icons";
import { INSTALL_HREF, marketingMetadata } from "./_lib/metadata";

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
        <PublicHeader variant="dark" />

        <section className="relative overflow-hidden bg-accent pb-10 pt-12 text-accent-content sm:pt-20 lg:pb-20 lg:pt-24">
            <Container>
                <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-[0.06em] text-accent-content/55">
                            Shopify support automation
                        </p>
                        <h1 className="mt-4 max-w-6xl text-[clamp(3rem,13vw,6.5rem)] font-[330] leading-[0.98] text-accent-content sm:mt-5">
                            Order support that answers before the inbox grows.
                        </h1>
                    </div>
                    <div className="max-w-md lg:pb-4">
                        <p className="text-base leading-7 text-accent-content/70 sm:text-lg sm:leading-8">
                            Valyn detects order-tracking emails, finds the
                            matching Shopify order, and replies from your own
                            address with accurate tracking details.
                        </p>
                        <Link href={INSTALL_HREF} className="btn mt-8">
                            <ShopifyBox className="size-4 shrink-0" />
                            Install on Shopify
                        </Link>
                    </div>
                </div>
            </Container>

            <div className="mt-10 lg:mt-16">
                <div className="relative h-[280px] overflow-hidden sm:h-[440px] lg:h-[560px]">
                    <Image
                        src="https://images.unsplash.com/photo-1556741533-6e6a62bd8b49?auto=format&fit=crop&w=2200&q=82"
                        alt="Merchant preparing ecommerce orders in a studio workspace"
                        fill
                        priority
                        sizes="100vw"
                        className="object-cover"
                    />
                </div>
            </div>

            <Container>
                <div className="grid border-b border-t border-accent-content/15 py-6 sm:grid-cols-2 lg:grid-cols-4">
                    {trustStats.map((s) => (
                        <div
                            className="border-accent-content/15 py-4 sm:border-r sm:px-6 sm:last:border-r-0"
                            key={s.l}
                        >
                            <div className="text-4xl font-[330] text-accent-content">
                                {s.v}
                            </div>
                            <div className="mt-2 text-sm text-accent-content/60">
                                {s.l}
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </section>

        <section className="bg-accent py-16 text-accent-content lg:py-28">
            <Container>
                <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-[0.06em] text-accent-content/55">
                            The problem
                        </p>
                        <h2 className="mt-5 text-[2.7rem] font-[330] leading-[1.02] text-accent-content sm:text-6xl lg:text-[72px]">
                            Your support inbox should not be a tracking lookup
                            queue.
                        </h2>
                    </div>
                    <div className="grid gap-3">
                        {problems.map((p) => (
                            <div
                                className="flex items-start gap-5 rounded-xl border border-accent-content/10 bg-accent-content/[0.035] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                                key={p.title}
                            >
                                <div className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-accent-content/20 text-accent-content [&_svg]:size-5">
                                    {p.icon}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-[330] leading-tight text-accent-content">
                                        {p.title}
                                    </h3>
                                    <p className="mt-2 text-sm leading-6 text-accent-content/62">
                                        {p.body}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Container>
        </section>

        <Section bg="soft">
            <Container>
                <SectionHead
                    eyebrow="How it works"
                    title="Four controlled steps. No helpdesk migration."
                    description="The workflow is narrow on purpose: receive, detect, look up, reply."
                />
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                    {steps.map((s) => (
                        <div
                            className="rounded-xl border border-base-300 bg-base-100 p-6 shadow-[0_8px_8px_rgba(0,0,0,0.08),0_4px_4px_rgba(0,0,0,0.06),0_2px_2px_rgba(0,0,0,0.05)]"
                            key={s.n}
                        >
                            <div className="mb-5 text-sm font-medium text-base-content/50">
                                0{s.n}
                            </div>
                            <h3 className="text-2xl font-[330] leading-tight text-base-content">
                                {s.title}
                            </h3>
                            <p className="mt-3 text-sm leading-6 text-base-content/70">
                                {s.body}
                            </p>
                        </div>
                    ))}
                </div>
            </Container>
        </Section>

        <Section>
            <Container>
                <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-[0.06em] text-base-content/55">
                            Live reply preview
                        </p>
                        <h2 className="mt-5 text-[2.65rem] font-[330] leading-[1.06] text-base-content sm:text-6xl">
                            The answer goes out before the ticket pile forms.
                        </h2>
                        <p className="mt-5 text-base leading-7 text-base-content/70 sm:text-lg sm:leading-8">
                            Customers see your sender, your signature, and the
                            Shopify order data they were asking for.
                        </p>
                    </div>
                    <EmailDemo />
                </div>
            </Container>
        </Section>

        <Section bg="warm">
            <Container>
                <SectionHead
                    eyebrow="Features"
                    title="Built for one job. Built well."
                    description="No chatbot sprawl. No omnichannel helpdesk bloat. Just the repetitive order-tracking workload."
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

        <Section bg="soft">
            <Container>
                <SectionHead
                    eyebrow="Embedded admin"
                    title="You stay in control. Always."
                    description="The Valyn dashboard lives inside Shopify admin. Every reply is logged. Every automation is reviewable."
                />
                <DashboardMockup />
            </Container>
        </Section>

        <Section>
            <Container>
                <div className="grid gap-5 md:grid-cols-3">
                    {useCases.map((u) => (
                        <div className={cardClass} key={u.title}>
                            <h3>{u.title}</h3>
                            <p>{u.body}</p>
                        </div>
                    ))}
                </div>
            </Container>
        </Section>

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
                                className="btn btn-primary mt-auto"
                            >
                                Choose {plan.name}
                            </Link>
                        </div>
                    ))}
                </div>
            </Container>
        </Section>

        <Section>
            <Container>
                <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:items-start">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-[0.06em] text-base-content/55">
                            Trust & security
                        </p>
                        <h2 className="mt-5 text-[2.65rem] font-[330] leading-[1.06] text-base-content sm:text-6xl">
                            Designed with merchant trust in mind.
                        </h2>
                        <p className="mt-5 max-w-2xl text-base leading-7 text-base-content/70 sm:text-lg sm:leading-8">
                            Valyn asks Shopify for the minimum permissions
                            needed and nothing more. It never modifies your
                            store.
                        </p>
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
                        All questions
                    </Link>
                </div>
            </Container>
        </Section>

        <Section>
            <Container>
                <div className="rounded-xl bg-accent p-8 text-center text-accent-content sm:p-12 lg:p-16">
                    <h2 className="mx-auto max-w-4xl text-4xl font-[330] leading-[1.05] sm:text-5xl lg:text-[70px]">
                        Start automating order support today.
                    </h2>
                    <p className="mx-auto mt-5 max-w-2xl text-accent-content/70">
                        Install on Shopify in under two minutes. 7-day free
                        trial, no card required.
                    </p>
                    <Link href={INSTALL_HREF} className="btn mt-8">
                        Install on Shopify
                    </Link>
                </div>
            </Container>
        </Section>

        <PublicFooter />
    </>
);

export default Page;
