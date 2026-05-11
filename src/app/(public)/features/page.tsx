import type { Metadata } from "next";
import {
    Container,
    FinalCta,
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
    title: "Features — Valyn",
    description:
        "Everything Valyn does to handle repetitive order tracking support for Shopify stores.",
    path: "/features",
});

const detectionPoints = [
    'Phrase & intent matching for "where is", "tracking", "commande", "colis", "livraison", "Lieferung"',
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

const classificationLines: [string, string, "ok" | "warn" | "muted", string][] = [
    ["14:02 → ", '"where is my order"', "ok", "WISMO"],
    ["14:08 → ", '"ma commande"', "ok", "WISMO"],
    ["14:11 → ", '"can i change my address?"', "muted", "SKIP"],
    ["14:18 → ", '"tracking link broken"', "warn", "REVIEW"],
    ["14:22 → ", '"wo ist mein paket"', "ok", "WISMO"],
    ["14:29 → ", '"i want a refund"', "muted", "SKIP"],
];

const lookupRows: { pill: "ok" | "warn" | "muted"; tag: string; title: string; body: string }[] = [
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
    <li>
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
                <div className="feat-row">
                    <div>
                        <span className="kicker">01 — Detection</span>
                        <h2 style={{ marginTop: 14 }}>
                            WISMO detection that actually skips the rest.
                        </h2>
                        <p className="lede" style={{ marginTop: 18 }}>
                            Keyword + sender classification flags
                            order-tracking emails in three languages.
                            Everything else lands untouched in your inbox so
                            real support still reaches you.
                        </p>
                        <ul className="check-list">
                            {detectionPoints.map((p) => (
                                <ChecklistItem key={p} text={p} />
                            ))}
                        </ul>
                    </div>
                    <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                        <div
                            style={{
                                padding: "14px 18px",
                                background: "var(--bg-soft)",
                                borderBottom: "1px solid var(--line)",
                                fontSize: 12,
                                color: "var(--muted)",
                                fontFamily: "var(--font-mono)",
                            }}
                        >
                            classification.log
                        </div>
                        <div
                            style={{
                                padding: 22,
                                fontFamily: "var(--font-mono)",
                                fontSize: 13,
                                lineHeight: 1.8,
                            }}
                        >
                            {classificationLines.map(([t, q, tone, tag]) => (
                                <div key={`${t}${q}`}>
                                    <span style={{ color: "var(--muted)" }}>
                                        {t}
                                    </span>{" "}
                                    {q}
                                    <span
                                        className={`pill ${tone}`}
                                        style={{ marginLeft: 6 }}
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
                <div className="feat-row">
                    <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                        <div
                            style={{
                                padding: "14px 18px",
                                background: "var(--bg-soft)",
                                borderBottom: "1px solid var(--line)",
                                fontSize: 12,
                                color: "var(--muted)",
                                fontFamily: "var(--font-mono)",
                            }}
                        >
                            order.lookup
                        </div>
                        <div style={{ padding: 22 }}>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 14,
                                }}
                            >
                                {lookupRows.map((row) => (
                                    <div
                                        key={row.tag}
                                        style={{
                                            display: "flex",
                                            gap: 12,
                                            alignItems: "flex-start",
                                        }}
                                    >
                                        <span
                                            className={`pill ${row.pill}`}
                                            style={{ flexShrink: 0 }}
                                        >
                                            {row.tag}
                                        </span>
                                        <div style={{ fontSize: 13 }}>
                                            <strong>{row.title}</strong>
                                            <br />
                                            <span style={{ color: "var(--muted)" }}>
                                                {row.body}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div>
                        <span className="kicker">02 — Lookup</span>
                        <h2 style={{ marginTop: 14 }}>
                            Three ways to find the order. One graceful
                            fallback.
                        </h2>
                        <p className="lede" style={{ marginTop: 18 }}>
                            Order numbers come in dozens of formats. Senders
                            email from addresses that don&apos;t match their
                            Shopify customer record. Valyn tries the obvious
                            match first and degrades cleanly when it
                            can&apos;t.
                        </p>
                        <ul className="check-list">
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
                <div className="feat-row">
                    <div>
                        <span className="kicker">03 — Reply</span>
                        <h2 style={{ marginTop: 14 }}>
                            Sent from your address. In your voice.
                        </h2>
                        <p className="lede" style={{ marginTop: 18 }}>
                            Replies go out via your own SMTP. The customer
                            sees your domain, your signature, your tone.
                            Valyn is invisible in the conversation.
                        </p>
                        <ul className="check-list">
                            {replyPoints.map((p) => (
                                <ChecklistItem key={p} text={p} />
                            ))}
                        </ul>
                    </div>
                    <div className="email out" style={{ borderRadius: 14 }}>
                        <div className="meta">
                            <div className="from">support@yourstore.com</div>
                            <div className="time">14:02</div>
                        </div>
                        <div className="subject">Re: Where is my order?</div>
                        <div className="body">
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
                            <span
                                style={{
                                    color: "var(--green-deep)",
                                    textDecoration: "underline",
                                }}
                            >
                                track.dhl.com/EU728193…
                            </span>
                            <br />
                            <br />
                            Expected delivery:{" "}
                            <strong>Thursday, May 14</strong>.
                            <br />
                            <br />
                            <span style={{ color: "var(--muted)" }}>
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
                <div className="grid-4">
                    {dashboardCards.map((c) => (
                        <div className="card" key={c.title}>
                            <div className="ico-box">{c.icon}</div>
                            <h3>{c.title}</h3>
                            <p>{c.body}</p>
                        </div>
                    ))}
                </div>
            </Container>
        </Section>

        <Section>
            <Container>
                <div className="callout">
                    <div className="icon">
                        <AlertCircle
                            style={{
                                width: 18,
                                height: 18,
                                color: "#8a5a08",
                            }}
                        />
                    </div>
                    <div>
                        <h3 style={{ marginBottom: 8 }}>
                            What Valyn doesn&apos;t do
                        </h3>
                        <p style={{ marginBottom: 0, color: "var(--ink-2)" }}>
                            No returns automation. No refunds. No live chat.
                            No AI chatbot. No social DMs. No marketing emails.
                            No abandoned-cart recovery. No multi-mailbox
                            routing. If you need any of those, you need a
                            different tool — and that&apos;s fine. We&apos;re
                            focused on WISMO, end of story.
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
