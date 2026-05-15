import type { Metadata } from "next";
import {
    cardClass,
    checkItemClass,
    Container,
    FinalCta,
    iconBoxClass,
    pillClass,
    PageHead,
    PublicFooter,
    PublicHeader,
    Section,
    SectionHead,
} from "../_components/site-shell";
import {
    Activity,
    AlertCircle,
    Check,
    Cog,
    FileText,
    Clipboard,
} from "../_components/icons";
import { marketingMetadata } from "../_lib/metadata";

export const metadata: Metadata = marketingMetadata({
    title: "Features — Valyn Shopify WISMO automation",
    description:
        "Everything Valyn does to handle repetitive order tracking support for Shopify stores.",
    path: "/features",
});

const detectionPoints = [
    "AI intent detection in English, French, and German — understands phrasing, not just keywords",
    "Strictness control — auto-reply, queue for review, or pass through",
    "False-positive rate logged and reviewable in your dashboard",
];

const lookupPoints = [
    "Confidence threshold — never replies on a guess",
    "Multiple orders → most recent is selected and disclosed",
    "Customer privacy preserved — only the matched order is read",
];

const replyPoints = [
    "Per-shop SMTP credentials, encrypted at rest",
    "Tone: neutral, friendly, formal",
    "Optional delay — instant, 2 min, or 10 min",
    "Threading preserved — customer reply lands back in your inbox",
];

const dashboardCards = [
    {
        icon: <Activity />,
        title: "Live stats",
        body: "Processed, detected, replied, failed — by week, by day, by hour.",
    },
    {
        icon: <Clipboard />,
        title: "Email log",
        body: "Every processed message — customer, intent, matched order, reply preview.",
    },
    {
        icon: <Cog />,
        title: "Controls",
        body: "Enable, pause, retry, override — one click, no settings page hunt.",
    },
    {
        icon: <FileText />,
        title: "Export",
        body: "CSV of every email and reply, on demand. Take it anywhere.",
    },
];

const classificationLines: [string, string, "ok" | "warn" | "muted", string][] =
    [
        ["14:02 → ", '"where is my order"', "ok", "WISMO"],
        ["14:08 → ", '"ma commande"', "ok", "WISMO"],
        ["14:11 → ", '"can i change my address?"', "muted", "SKIP"],
        ["14:18 → ", '"tracking link broken"', "warn", "REVIEW"],
        ["14:22 → ", '"wo ist mein paket"', "ok", "WISMO"],
        ["14:29 → ", '"i want a refund"', "muted", "SKIP"],
    ];

const lookupRows: {
    pill: "ok" | "warn" | "muted";
    tag: string;
    title: string;
    body: string;
}[] = [
    {
        pill: "ok",
        tag: "1st try",
        title: "Order number in subject or body",
        body: '"order #1042" → match on shop_id + order_number',
    },
    {
        pill: "ok",
        tag: "2nd try",
        title: "Sender email match",
        body: "customer.email LIKE sender → most recent order",
    },
    {
        pill: "warn",
        tag: "3rd try",
        title: "Best-guess from recent activity",
        body: "low-confidence → flag for manual review",
    },
    {
        pill: "muted",
        tag: "Fallback",
        title: "No match found",
        body: "polite reply asking for order # + queue for review",
    },
];

const ChecklistItem = ({ text }: { text: string }) => (
    <li className={checkItemClass}>
        <Check />
        <span>{text}</span>
    </li>
);

const Page = () => (
    <>
        <PublicHeader active="features" />

        <PageHead
            eyebrow="Features"
            title={
                <>
                    Everything Valyn does.
                    <br />
                    Nothing it doesn&apos;t.
                </>
            }
            description="A focused list. If something isn't on this page, Valyn doesn't try to do it — by design."
        />

        <Section>
            <Container>
                <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
                    <div>
                        <span className="text-xs font-medium uppercase tracking-[0.06em] text-base-content/70">
                            01 — Detection
                        </span>
                        <h2 style={{ marginTop: 14 }}>
                            WISMO detection that actually skips the rest.
                        </h2>
                        <p
                            className="max-w-2xl text-lg leading-8 text-base-content/70 sm:text-xl"
                            style={{ marginTop: 18 }}
                        >
                            An AI classifier reads each email and flags genuine
                            order-tracking questions in three languages —
                            telling them apart from newsletters, returns, and
                            noise. Everything else lands untouched in your inbox
                            so real support still reaches you.
                        </p>
                        <ul className="mt-6 grid gap-3">
                            {detectionPoints.map((p) => (
                                <ChecklistItem key={p} text={p} />
                            ))}
                        </ul>
                    </div>
                    <div
                        className={cardClass}
                        style={{ padding: 0, overflow: "hidden" }}
                    >
                        <div className="border-b border-base-300 bg-base-200 px-[18px] py-3.5 text-xs text-base-content/70">
                            classification.log
                        </div>
                        <div className="p-[22px] text-[13px] leading-7 text-base-content">
                            {classificationLines.map(([t, q, tone, tag]) => (
                                <div key={`${t}${q}`}>
                                    <span className="text-base-content/60">
                                        {t}
                                    </span>{" "}
                                    {q}
                                    <span
                                        className={`${pillClass(tone)} ml-1.5`}
                                    >
                                        {tag}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Container>
        </Section>

        <Section bg="soft">
            <Container>
                <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
                    <div
                        className={cardClass}
                        style={{ padding: 0, overflow: "hidden" }}
                    >
                        <div className="border-b border-base-300 bg-base-200 px-[18px] py-3.5 text-xs text-base-content/70">
                            order.lookup
                        </div>
                        <div className="p-[22px]">
                            <div className="grid gap-3.5">
                                {lookupRows.map((row) => (
                                    <div
                                        key={row.tag}
                                        className="flex items-start gap-3"
                                    >
                                        <span
                                            className={`${pillClass(row.pill)} shrink-0`}
                                        >
                                            {row.tag}
                                        </span>
                                        <div className="text-[13px] leading-6">
                                            <strong>{row.title}</strong>
                                            <br />
                                            <span className="text-base-content/70">
                                                {row.body}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div>
                        <span className="text-xs font-medium uppercase tracking-[0.06em] text-base-content/70">
                            02 — Lookup
                        </span>
                        <h2 style={{ marginTop: 14 }}>
                            Three ways to find the order. One graceful fallback.
                        </h2>
                        <p
                            className="max-w-2xl text-lg leading-8 text-base-content/70 sm:text-xl"
                            style={{ marginTop: 18 }}
                        >
                            Order numbers come in dozens of formats. Senders
                            email from addresses that don&apos;t match their
                            Shopify customer record. Valyn tries the obvious
                            match first and degrades cleanly when it can&apos;t.
                        </p>
                        <ul className="mt-6 grid gap-3">
                            {lookupPoints.map((p) => (
                                <ChecklistItem key={p} text={p} />
                            ))}
                        </ul>
                    </div>
                </div>
            </Container>
        </Section>

        <Section>
            <Container>
                <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
                    <div>
                        <span className="text-xs font-medium uppercase tracking-[0.06em] text-base-content/70">
                            03 — Reply
                        </span>
                        <h2 style={{ marginTop: 14 }}>
                            Sent from your address. In your voice.
                        </h2>
                        <p
                            className="max-w-2xl text-lg leading-8 text-base-content/70 sm:text-xl"
                            style={{ marginTop: 18 }}
                        >
                            Replies go out via your own SMTP. The customer sees
                            your domain, your signature, your tone. Valyn is
                            invisible in the conversation.
                        </p>
                        <ul className="mt-6 grid gap-3">
                            {replyPoints.map((p) => (
                                <ChecklistItem key={p} text={p} />
                            ))}
                        </ul>
                    </div>
                    <div className="rounded-lg border border-base-content/10 bg-secondary p-4">
                        <div className="mb-2 flex items-start justify-between gap-3 text-xs text-base-content/70">
                            <div className="font-semibold text-base-content">
                                support@yourstore.com
                            </div>
                            <div className="">14:02</div>
                        </div>
                        <div className="mb-3 font-semibold text-base-content">
                            Re: Where is my order?
                        </div>
                        <div className="text-sm leading-7 text-base-content/80">
                            Hi Sarah,
                            <br />
                            <br />
                            Thanks for getting in touch. Your order{" "}
                            <strong>#1042</strong> is on its way with{" "}
                            <strong>DHL Express</strong>.
                            <br />
                            <br />
                            You can follow it here:
                            <br />
                            <span className="text-base-content underline">
                                track.dhl.com/EU728193…
                            </span>
                            <br />
                            <br />
                            Expected delivery: <strong>Thursday, May 14</strong>
                            .
                            <br />
                            <br />
                            <span className="text-base-content/70">
                                — The team at Yourstore
                                <br />
                                support@yourstore.com
                            </span>
                        </div>
                    </div>
                </div>
            </Container>
        </Section>

        <Section bg="warm">
            <Container>
                <SectionHead
                    eyebrow="04 — Dashboard"
                    title="Embedded inside Shopify. Always one click away."
                    description="Live status of every automation, every email, every failed lookup. No new tab, no separate login."
                />
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {dashboardCards.map((c) => (
                        <div className={cardClass} key={c.title}>
                            <div className={iconBoxClass}>{c.icon}</div>
                            <h3>{c.title}</h3>
                            <p>{c.body}</p>
                        </div>
                    ))}
                </div>
            </Container>
        </Section>

        <Section>
            <Container>
                <div className="flex gap-4 rounded-lg border border-base-300 bg-base-100 p-5 shadow-sm">
                    <div className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-warning/20 text-warning">
                        <AlertCircle className="size-[18px]" />
                    </div>
                    <div>
                        <h3 style={{ marginBottom: 8 }}>
                            What Valyn doesn&apos;t do
                        </h3>
                        <p
                            style={{
                                marginBottom: 0,
                                color: "var(--color-base-content)",
                            }}
                        >
                            No returns automation. No refunds. No live chat. AI
                            detects intent, but never writes replies — those
                            come from your templates and real Shopify data. No
                            social DMs. No marketing emails. No abandoned-cart
                            recovery. No multi-mailbox routing. If you need any
                            of those, you need a different tool — and
                            that&apos;s fine. We&apos;re focused on WISMO, end
                            of story.
                        </p>
                    </div>
                </div>
            </Container>
        </Section>

        <FinalCta
            title="See it in action."
            description="Watch the full flow on the demo page — no install required."
            primaryHref="/demo"
            primaryLabel="View demo"
        />

        <PublicFooter />
    </>
);

export default Page;
