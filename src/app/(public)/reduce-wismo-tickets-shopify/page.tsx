import type { Metadata } from "next";
import Link from "next/link";
import {
    Container,
    PageHead,
    PublicFooter,
    PublicHeader,
    Section,
    SectionHead,
} from "../_components/site-shell";
import { Check } from "../_components/icons";
import { INSTALL_HREF, marketingMetadata } from "../_lib/metadata";

export const metadata: Metadata = marketingMetadata({
    title: "Reduce WISMO tickets for your Shopify store",
    description:
        "Why customers ask “where is my order?”, what those tickets cost, and how Shopify merchants reduce WISMO support workload.",
    path: "/reduce-wismo-tickets-shopify",
});

const otherGuides = [
    {
        title: "Features overview",
        href: "/features",
        body: "What Valyn does, end to end. Detection, lookup, reply, and dashboard.",
    },
    {
        title: "vs. Gorgias",
        href: "/gorgias-alternative",
        body: "When a focused tool makes more sense than a full helpdesk.",
    },
    {
        title: "Live demo",
        href: "/demo",
        body: "Watch a real WISMO email flow through detection → reply.",
    },
];

const Page = () => (
    <>
        <PublicHeader />

        <PageHead
            eyebrow="Guide · 6 min read"
            title="Reduce WISMO tickets for your Shopify store."
            description={`"Where is my order?" emails eat support time. Here's why they happen, what they actually cost you, and how to make most of them answer themselves.`}
        />

        <Section style={{ paddingTop: 48 }}>
            <article className="article">
                <div className="toc">
                    <h5>In this guide</h5>
                    <ol>
                        <li>
                            <a href="#what">What WISMO means</a>
                        </li>
                        <li>
                            <a href="#why">
                                Why customers ask it (and ask it again)
                            </a>
                        </li>
                        <li>
                            <a href="#cost">
                                What WISMO actually costs your store
                            </a>
                        </li>
                        <li>
                            <a href="#fix">
                                Four practical ways to reduce WISMO tickets
                            </a>
                        </li>
                        <li>
                            <a href="#auto">
                                When to automate the reply itself
                            </a>
                        </li>
                        <li>
                            <a href="#valyn">How Valyn handles it end-to-end</a>
                        </li>
                    </ol>
                </div>

                <h2 id="what">What WISMO means</h2>
                <p>
                    <strong>WISMO</strong> stands for{" "}
                    <em>&ldquo;Where Is My Order?&rdquo;</em> — the most common
                    customer support question in ecommerce. It&apos;s the email
                    or chat message a customer sends between the moment they pay
                    and the moment the package arrives, asking for an update on
                    shipping status.
                </p>
                <p>
                    For a Shopify merchant, WISMO usually arrives in three
                    flavors:
                </p>
                <ul>
                    <li>
                        &ldquo;Hi, I ordered last week and haven&apos;t received
                        it yet.&rdquo;
                    </li>
                    <li>
                        &ldquo;Where is order #1042? It says shipped but no
                        tracking.&rdquo;
                    </li>
                    <li>
                        &ldquo;Can you tell me when this will arrive? —
                        [customer&apos;s address]&rdquo;
                    </li>
                </ul>
                <p>
                    In all three, the answer is the same: read the order, read
                    the fulfillment, paste the tracking link, mention the ETA.
                    It&apos;s not really support. It&apos;s a lookup.
                </p>

                <h2 id="why">Why customers ask it (and ask it again)</h2>
                <p>Three reasons, in roughly this order:</p>
                <ol>
                    <li>
                        <strong>
                            The order confirmation didn&apos;t include a
                            tracking link.
                        </strong>{" "}
                        Sometimes because tracking wasn&apos;t available yet at
                        confirmation time, sometimes because the email template
                        doesn&apos;t surface it well.
                    </li>
                    <li>
                        <strong>
                            The customer doesn&apos;t know where to look.
                        </strong>{" "}
                        They have the confirmation email but not the shipping
                        email, or they searched the wrong inbox, or the email
                        landed in promotions.
                    </li>
                    <li>
                        <strong>The shipping status is genuinely stale.</strong>{" "}
                        &ldquo;Pre-shipment&rdquo; for four days. &ldquo;In
                        transit&rdquo; for a week with no scans. The carrier
                        broke; the customer wants reassurance.
                    </li>
                </ol>

                <div className="stat-pull">
                    <div className="b">
                        <div className="v">~60%</div>
                        <div className="l">
                            of repeat-volume support tickets are WISMO
                        </div>
                    </div>
                    <div className="b">
                        <div className="v">3.4 min</div>
                        <div className="l">
                            average manual handle-time per ticket
                        </div>
                    </div>
                    <div className="b">
                        <div className="v">2.1x</div>
                        <div className="l">
                            repeat rate per customer per order
                        </div>
                    </div>
                </div>

                <h2 id="cost">What WISMO actually costs your store</h2>
                <p>
                    It&apos;s not the tickets — it&apos;s the math behind them.
                    If your store ships 1,000 orders per week and even 8% of
                    customers email asking about tracking, that&apos;s 80 emails
                    per week. At 3 minutes each, that&apos;s{" "}
                    <strong>4 hours of weekly support time</strong> spent on
                    lookup, not on real customer problems.
                </p>
                <p>
                    The non-obvious cost: <strong>response delay</strong>. A
                    WISMO email that goes unanswered for 18 hours often turns
                    into a chargeback dispute, a one-star review, or a refund
                    request — none of which started as a real problem.
                </p>

                <blockquote>
                    The fastest way to reduce WISMO complaints isn&apos;t a
                    better tracking page. It&apos;s faster acknowledgement that
                    the order exists, is shipping, and has a tracking link.
                </blockquote>

                <h2 id="fix">Four practical ways to reduce WISMO tickets</h2>

                <h3>1. Fix the shipping confirmation</h3>
                <p>
                    Audit your Shopify &ldquo;Shipping confirmation&rdquo;
                    notification template. The tracking link should be the most
                    visible element above the fold. If you use a custom theme
                    app, make sure it&apos;s still firing — broken shipping
                    emails are a surprisingly common WISMO source.
                </p>

                <h3>2. Add a self-service tracking page</h3>
                <p>
                    A simple{" "}
                    <code
                        className="mono"
                        style={{
                            background: "var(--bg-soft)",
                            padding: "2px 6px",
                            borderRadius: 4,
                            fontSize: 14,
                        }}
                    >
                        /track
                    </code>{" "}
                    page on your storefront, where customers can enter an order
                    number and see status, reduces inbound emails. AfterShip,
                    Parcel Panel, and others do this well. It won&apos;t
                    eliminate WISMO — many customers will email anyway — but it
                    cuts the curious ones.
                </p>

                <h3>3. Set realistic shipping expectations on the PDP</h3>
                <p>
                    If your dropshipping window is 7–14 days, say so on the
                    product page. Customers email when expectations and reality
                    disagree, not when the wait is long.
                </p>

                <h3>4. Use proactive transit notifications</h3>
                <p>
                    &ldquo;Your order is out for delivery today.&rdquo; Sent the
                    morning of, not when the package is already on the doorstep.
                    This single email reduces WISMO by 20–30% in stores that
                    adopt it.
                </p>

                <h2 id="auto">When to automate the reply itself</h2>
                <p>
                    The four steps above reduce WISMO volume by maybe 40%. The
                    remaining 60% will still email — because customers,
                    especially anxious ones, want a human (or human-looking)
                    reply to a question they&apos;re worried about.
                </p>
                <p>
                    That&apos;s the point where you stop trying to prevent WISMO
                    and start answering it instantly, automatically, in your own
                    voice.
                </p>
                <p>Automated WISMO replies should:</p>
                <ul>
                    <li>
                        <strong>Send within seconds</strong>, not the next
                        business day
                    </li>
                    <li>
                        <strong>Use real order data</strong> — never invent
                        tracking that doesn&apos;t exist
                    </li>
                    <li>
                        <strong>
                            Include the tracking link, carrier, and an ETA
                        </strong>
                    </li>
                    <li>
                        <strong>Come from your domain</strong>, not a
                        third-party &ldquo;noreply&rdquo; address
                    </li>
                    <li>
                        <strong>Be skippable</strong> — if Valyn can&apos;t
                        confidently match the order, escalate to a human
                    </li>
                </ul>

                <h2 id="valyn">How Valyn handles it end-to-end</h2>
                <p>
                    Valyn is a Shopify app focused on exactly this problem. You
                    forward your support inbox (or a dedicated tracking inbox)
                    to a Valyn address. When a WISMO email arrives:
                </p>
                <ol>
                    <li>
                        Valyn detects intent in EN/FR/DE and skips non-WISMO
                        mail
                    </li>
                    <li>
                        It identifies the order from order number, customer
                        email, or recent history
                    </li>
                    <li>
                        It composes a reply using your template and real Shopify
                        order data
                    </li>
                    <li>
                        It sends from your own SMTP — the customer sees your
                        domain
                    </li>
                    <li>It logs everything in your Shopify admin for review</li>
                </ol>
                <p>
                    If it can&apos;t confidently match the order, it either asks
                    for the order number politely or skips entirely — your call.
                </p>

                <div className="callout" style={{ marginTop: 32 }}>
                    <div className="icon">
                        <Check
                            style={{
                                width: 18,
                                height: 18,
                                color: "#0d9b48",
                            }}
                        />
                    </div>
                    <div>
                        <h4 style={{ marginBottom: 6 }}>
                            Try it on your store
                        </h4>
                        <p style={{ margin: 0 }}>
                            7-day free trial, no card. Install Valyn, forward
                            one email, see how it handles it.
                        </p>
                        <div style={{ marginTop: 14 }}>
                            <Link
                                href={INSTALL_HREF}
                                className="btn btn-green btn-sm"
                                style={{ marginRight: 8 }}
                            >
                                Install on Shopify
                            </Link>
                            <Link href="/demo" className="btn btn-ghost btn-sm">
                                View demo
                            </Link>
                        </div>
                    </div>
                </div>
            </article>
        </Section>

        <Section bg="soft">
            <Container>
                <SectionHead
                    eyebrow="Keep reading"
                    title="More on Shopify support automation."
                />
                <div className="grid-3">
                    {otherGuides.map((g) => (
                        <Link key={g.href} href={g.href} className="card">
                            <h3>{g.title}</h3>
                            <p>{g.body}</p>
                            <p
                                style={{
                                    marginTop: 12,
                                    color: "var(--green-deep)",
                                    fontWeight: 540,
                                    fontSize: 14,
                                }}
                            >
                                Read →
                            </p>
                        </Link>
                    ))}
                </div>
            </Container>
        </Section>

        <PublicFooter />
    </>
);

export default Page;
