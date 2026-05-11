import type { Metadata } from "next";
import Link from "next/link";
import {
    Container,
    faqAnswerClass,
    faqDetailsClass,
    faqIconClass,
    faqSummaryClass,
    PageHead,
    PublicFooter,
    PublicHeader,
    Section,
} from "../_components/site-shell";
import { marketingMetadata, SUPPORT_EMAIL } from "../_lib/metadata";

export const metadata: Metadata = marketingMetadata({
    title: "FAQ — Valyn",
    description:
        "Detailed answers about Valyn's features, setup, GDPR posture, billing, and language coverage.",
    path: "/faq",
});

type Faq = { q: string; a: React.ReactNode; open?: boolean };

const groups: { kicker: string; title: string; items: Faq[] }[] = [
    {
        kicker: "The basics",
        title: "What it does",
        items: [
            {
                q: "What does Valyn do, exactly?",
                a: 'Valyn watches a support email inbox you forward to it, detects "where is my order?" type emails (WISMO), looks up the matching order in your Shopify store, and replies automatically with the tracking link, carrier, and ETA — sent from your own email address.',
                open: true,
            },
            {
                q: "Is this an AI chatbot?",
                a: "No. The first version uses deterministic keyword classification, not a generative model. Replies use templates you can edit. We may add ML classification later, but Valyn will never invent information about an order — it only reports what Shopify says is true.",
            },
            {
                q: "Does it replace my helpdesk?",
                a: "No, and it isn't trying to. Valyn handles the repetitive 60% of your inbox — tracking questions — so your real helpdesk (or your own time) is freed for everything else: returns, complaints, product questions, fraud cases. If you don't have a helpdesk, Valyn is the smallest possible step up from \"just my Gmail.\"",
            },
            {
                q: "How long does setup take?",
                a: "Under 5 minutes for most stores. Install from the Shopify App Store, paste your SMTP credentials (Gmail app password works), copy the forwarding address Valyn gives you into your support inbox forwarding rule, send a test email. That's it.",
            },
        ],
    },
    {
        kicker: "Setup & data",
        title: "Permissions and access",
        items: [
            {
                q: "What Shopify permissions does Valyn ask for?",
                a: "Read-only on orders, fulfillments, and customers. That's all. We can read enough order data to compose an accurate reply. We cannot modify orders, create customers, charge cards, or change anything in your store. We also subscribe to standard uninstall and GDPR webhooks so we can clean up when you leave.",
            },
            {
                q: "Where does my data live?",
                a: "Inbound email MIME files are stored in AWS S3 (us-east-1) for 30 days, then auto-expire. Order and reply logs are stored in Postgres for the duration of your plan's retention window. SMTP credentials are encrypted at rest using a per-deployment key. Nothing is shared with third parties.",
            },
            {
                q: "Are you GDPR compliant?",
                a: "Yes. We honor Shopify's three mandatory GDPR webhooks (customers/data_request, customers/redact, shop/redact) and run a 48-hour deletion window from request to confirmation. We're a data processor; you're the controller. Sign our DPA from your dashboard.",
            },
            {
                q: "Why do you need my SMTP credentials?",
                a: 'So replies are sent from your domain, not ours. Customers see "support@yourstore.com" — Valyn is invisible in the conversation. If we sent from our own domain, deliverability would suffer and customers would be confused. Credentials are encrypted; you can rotate them or revoke access at any time.',
            },
        ],
    },
    {
        kicker: "Edge cases",
        title: "What if something goes wrong",
        items: [
            {
                q: "What if Valyn can't find the order?",
                a: "Two options, configurable from your dashboard: (1) send a polite fallback asking the customer for their order number, then flag the email for review, or (2) skip the reply entirely and queue the email for manual handling. Default is the fallback reply — it's almost always better than silence.",
            },
            {
                q: "What if the customer has multiple recent orders?",
                a: "If the email contains an order number, that order wins. If it doesn't, Valyn picks the most recent in-transit order and explicitly mentions which one it's referring to in the reply, so the customer can correct us if needed.",
            },
            {
                q: "What if Valyn misclassifies an email?",
                a: 'If we reply when we shouldn\'t have, you can hit "retract & flag" on the email in your dashboard — it pulls the row into the review queue, and the false-positive feeds into our detection tuning. Misclassification rate is shown on your overview screen so you always know how Valyn is performing.',
            },
            {
                q: "What if a customer replies to the auto-reply?",
                a: "The reply lands in your normal inbox — threading is preserved. Valyn doesn't try to loop the customer in an automation cycle. One auto-reply per inbound email, end of story.",
            },
            {
                q: "Can I pause automation if I'm out for the weekend?",
                a: "Yes — one click in the dashboard. Inbound emails are still received and logged, but Valyn doesn't reply until you toggle automation back on. You can also schedule pause windows.",
            },
        ],
    },
    {
        kicker: "Billing",
        title: "Money",
        items: [
            {
                q: "How much does it cost?",
                a: (
                    <>
                        Two plans: Starter $19/mo (500 emails) and Pro $49/mo
                        (3,000 emails). You&apos;ll be notified in the dashboard
                        before hitting your limit so you can upgrade.{" "}
                        <Link
                            href="/pricing"
                            className="text-primary underline"
                        >
                            Full pricing here
                        </Link>
                        .
                    </>
                ),
            },
            {
                q: "Is there a free trial?",
                a: "7 days on every plan. No card required to install. Billing only starts at the end of the trial — and only if you don't cancel.",
            },
            {
                q: "How do I cancel?",
                a: "Uninstall Valyn from your Shopify admin. Billing stops immediately, no portal hunt. Your data is kept for 30 days in case you come back, then permanently deleted.",
            },
        ],
    },
    {
        kicker: "Languages & markets",
        title: "Coverage",
        items: [
            {
                q: "Which languages does Valyn support?",
                a: "English, French, and German at launch. Each language has its own detection patterns and reply templates. We pick the reply language based on the inbound email's language — your customer hears back in their own language.",
            },
            {
                q: "Will you add more languages?",
                a: "Spanish, Dutch, and Italian are on the short list. Tell us which one matters for your store and we'll prioritize. We add a language when a meaningful number of merchants need it, not as a marketing checkbox.",
            },
        ],
    },
];

const Page = () => (
    <>
        <PublicHeader active="faq" />

        <PageHead
            eyebrow="FAQ"
            title="The longer answers."
            description={
                <>
                    If you&apos;re researching whether Valyn fits your store,
                    this is the page. Anything not covered here —{" "}
                    <a
                        href={`mailto:${SUPPORT_EMAIL}`}
                        className="text-primary underline"
                    >
                        ask us directly
                    </a>
                    .
                </>
            }
        />

        <Section style={{ paddingTop: 48 }}>
            <Container narrow>
                {groups.map((group, gi) => (
                    <div
                        key={group.title}
                        className={gi > 0 ? "mt-16" : undefined}
                    >
                        <span className="text-xs font-semibold uppercase tracking-normal text-base-content/70">
                            {group.kicker}
                        </span>
                        <h2 className="mb-[18px] mt-3.5 text-3xl font-semibold leading-tight text-base-content sm:text-4xl">
                            {group.title}
                        </h2>
                        <div className="grid gap-3">
                            {group.items.map((item, ii) => (
                                <details
                                    className={faqDetailsClass}
                                    key={item.q}
                                    open={item.open || (gi === 0 && ii === 0)}
                                >
                                    <summary className={faqSummaryClass}>
                                        {item.q}
                                        <span className={faqIconClass} />
                                    </summary>
                                    <div className={faqAnswerClass}>
                                        {item.a}
                                    </div>
                                </details>
                            ))}
                        </div>
                    </div>
                ))}
            </Container>
        </Section>

        <Section>
            <Container>
                <div
                    className="relative overflow-hidden rounded-box bg-accent p-8 text-center text-accent-content sm:p-10 lg:p-14"
                    id="contact"
                >
                    <h2 className="text-3xl font-semibold leading-tight text-accent-content sm:text-4xl">
                        Didn&apos;t find your answer?
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-accent-content/70">
                        We answer every email personally. Usually within a few
                        hours.
                    </p>
                    <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                        <a
                            href={`mailto:${SUPPORT_EMAIL}`}
                            className="btn btn-primary btn-lg"
                        >
                            {SUPPORT_EMAIL}
                        </a>
                        <Link
                            href="/demo"
                            className="btn btn-outline btn-lg border-accent-content/30 text-accent-content hover:bg-accent-content hover:text-accent"
                        >
                            View demo first
                        </Link>
                    </div>
                </div>
            </Container>
        </Section>

        <PublicFooter />
    </>
);

export default Page;
