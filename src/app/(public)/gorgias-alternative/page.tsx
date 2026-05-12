import type { Metadata } from "next";
import {
    cardClass,
    checkItemClass,
    checkMarkClass,
    cn,
    Container,
    dashMarkClass,
    featureTdClass,
    FinalCta,
    PageHead,
    PublicFooter,
    PublicHeader,
    Section,
    SectionHead,
    tableClass,
    tdClass,
    thClass,
} from "../_components/site-shell";
import { Check } from "../_components/icons";
import { marketingMetadata } from "../_lib/metadata";

export const metadata: Metadata = marketingMetadata({
    title: "Gorgias alternative — Valyn for Shopify WISMO",
    description:
        "A focused, simpler alternative to Gorgias for Shopify merchants who mostly need to automate WISMO support replies.",
    path: "/gorgias-alternative",
});

const chooseGorgias = [
    "You have a support team of 2+ people working from a shared inbox",
    "You handle support across many channels (email, chat, social DMs, SMS)",
    "You need ticket assignment, SLAs, internal notes, and reporting",
    "You want to build complex automation rules across many use cases",
    "You're willing to invest in setup, training, and a higher monthly cost",
];

const chooseValyn = [
    "You're a solo merchant or small team running support from one inbox",
    'Most of your support volume is "where is my order?" emails',
    "A full helpdesk feels like overkill — and it probably is, at your stage",
    "You want it set up today, not after a 3-week implementation",
    "You'd rather pay $19 than $60+ for a solution to one problem",
];

const compareRows: [string, string, string, boolean?][] = [
    [
        "WISMO auto-reply with order data",
        "✓ (requires rule setup)",
        "✓ Out of the box",
    ],
    ["Shopify order lookup", "✓", "✓"],
    ["Multi-language detection", "Add-on / configure", "EN, FR, DE built-in"],
    ["Send from your domain (SMTP)", "✓", "✓"],
    ["Ticket assignment & SLAs", "✓", "— (intentionally)"],
    ["Multi-channel inbox (chat, SMS, social)", "✓", "—"],
    ["Macros & canned responses", "✓", "Templates only"],
    ["Internal notes & collision detection", "✓", "—"],
    ["Reporting & analytics", "Full BI suite", "Essentials"],
    ["Setup time", "Days–weeks", "Under 5 minutes"],
    ["Starting price", "~$60/mo", "$19/mo", true],
];

const ChecksList = ({ items }: { items: string[] }) => (
    <ul className="grid gap-3.5">
        {items.map((t) => (
            <li className={checkItemClass} key={t}>
                <Check />
                <span>{t}</span>
            </li>
        ))}
    </ul>
);

const Page = () => (
    <>
        <PublicHeader active="gorgias" />

        <PageHead
            eyebrow="Comparison"
            title={
                <>
                    A simpler, focused alternative to Gorgias —
                    <br />
                    if you just need WISMO solved.
                </>
            }
            description="Gorgias is a great helpdesk. Valyn isn't trying to be a helpdesk. Here's where they overlap, where they don't, and how to pick."
        />

        <Section style={{ paddingTop: 48 }}>
            <Container>
                <div className="grid gap-5 md:grid-cols-2">
                    <div className={cardClass} style={{ padding: 32 }}>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 12,
                                marginBottom: 14,
                            }}
                        >
                            <div
                                style={{
                                    width: 36,
                                    height: 36,
                                    background: "var(--color-base-200)",
                                    borderRadius: 8,
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontWeight: 560,
                                    fontSize: 16,
                                }}
                            >
                                G
                            </div>
                            <h3 style={{ margin: 0 }}>Gorgias</h3>
                        </div>
                        <p
                            style={{
                                color: "var(--color-neutral)",
                                fontSize: 15,
                                lineHeight: 1.6,
                            }}
                        >
                            A full customer-support helpdesk. Multi-channel
                            inbox, automation rules, macros, a ticketing UI,
                            integrations with dozens of apps, reporting,
                            customer profiles, intent detection. Built to be the
                            center of your support operation.
                        </p>
                        <div
                            style={{
                                marginTop: 18,
                                paddingTop: 18,
                                borderTop: "1px solid var(--color-base-300)",
                                display: "flex",
                                flexDirection: "column",
                                gap: 10,
                                fontSize: 14,
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}
                            >
                                <span style={{ color: "var(--color-neutral)" }}>
                                    Starts at
                                </span>
                                <strong>~$60/mo</strong>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}
                            >
                                <span style={{ color: "var(--color-neutral)" }}>
                                    Setup
                                </span>
                                <strong>Days to weeks</strong>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}
                            >
                                <span style={{ color: "var(--color-neutral)" }}>
                                    Onboarding
                                </span>
                                <strong>Implementation call</strong>
                            </div>
                        </div>
                    </div>

                    <div
                        className={cardClass}
                        style={{
                            padding: 32,
                            background: "var(--color-base-200)",
                            borderColor: "#b8edcb",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 12,
                                marginBottom: 14,
                            }}
                        >
                            <div
                                style={{
                                    width: 36,
                                    height: 36,
                                    background:
                                        "linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary) 100%)",
                                    borderRadius: 8,
                                    color: "#052b13",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontWeight: 700,
                                }}
                            >
                                V
                            </div>
                            <h3 style={{ margin: 0 }}>Valyn</h3>
                        </div>
                        <p
                            style={{
                                color: "var(--color-base-content)",
                                fontSize: 15,
                                lineHeight: 1.6,
                            }}
                        >
                            A single tool that does one thing: read your inbox,
                            find Shopify orders, and reply to &quot;where is my
                            order?&quot; emails. No tickets, no macros, no rules
                            engine. The 60% of your inbox that&apos;s a tracking
                            lookup just stops happening.
                        </p>
                        <div
                            style={{
                                marginTop: 18,
                                paddingTop: 18,
                                borderTop: "1px solid #b8edcb",
                                display: "flex",
                                flexDirection: "column",
                                gap: 10,
                                fontSize: 14,
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}
                            >
                                <span
                                    style={{
                                        color: "var(--color-base-content)",
                                    }}
                                >
                                    Starts at
                                </span>
                                <strong>$19/mo</strong>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}
                            >
                                <span
                                    style={{
                                        color: "var(--color-base-content)",
                                    }}
                                >
                                    Setup
                                </span>
                                <strong>Under 5 minutes</strong>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}
                            >
                                <span
                                    style={{
                                        color: "var(--color-base-content)",
                                    }}
                                >
                                    Onboarding
                                </span>
                                <strong>Self-serve</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </Section>

        <Section bg="soft">
            <Container>
                <SectionHead
                    eyebrow="The decision"
                    title="Which one is right for your store?"
                />
                <div className="grid gap-5 md:grid-cols-2">
                    <div className={cardClass} style={{ padding: 32 }}>
                        <h3 style={{ marginBottom: 14 }}>Choose Gorgias if…</h3>
                        <ChecksList items={chooseGorgias} />
                    </div>
                    <div
                        className={cardClass}
                        style={{
                            padding: 32,
                            background: "#fff",
                            borderColor: "#b8edcb",
                        }}
                    >
                        <h3 style={{ marginBottom: 14 }}>Choose Valyn if…</h3>
                        <ChecksList items={chooseValyn} />
                    </div>
                </div>
                <p
                    style={{
                        textAlign: "center",
                        marginTop: 32,
                        color: "var(--color-neutral)",
                        fontSize: 15,
                        marginLeft: "auto",
                        marginRight: "auto",
                    }}
                >
                    Many stores run{" "}
                    <strong style={{ color: "var(--color-base-content)" }}>
                        both
                    </strong>{" "}
                    — Valyn handling tracking, a helpdesk handling everything
                    else. They don&apos;t compete.
                </p>
            </Container>
        </Section>

        <Section>
            <Container>
                <SectionHead
                    eyebrow="Feature by feature"
                    title="Side by side."
                    description="What each tool tries to be best at."
                />
                <table className={tableClass}>
                    <thead>
                        <tr>
                            <th className={cn(thClass, "w-[40%]")}>
                                Capability
                            </th>
                            <th className={thClass}>Gorgias</th>
                            <th className={cn(thClass, "text-base-content")}>
                                Valyn
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {compareRows.map(([cap, g, v, highlight]) => (
                            <tr key={cap}>
                                <td className={featureTdClass}>{cap}</td>
                                <td className={tdClass}>
                                    {g === "✓" ?
                                        <span className={checkMarkClass}>
                                            ✓
                                        </span>
                                    : g === "—" ?
                                        <span className={dashMarkClass}>—</span>
                                    :   g}
                                </td>
                                <td className={tdClass}>
                                    {v === "—" ?
                                        <span className={dashMarkClass}>—</span>
                                    : highlight ?
                                        <strong className="text-base-content">
                                            {v}
                                        </strong>
                                    :   v}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <p
                    style={{
                        textAlign: "center",
                        marginTop: 24,
                        color: "var(--color-neutral)",
                        fontSize: 13,
                    }}
                >
                    Comparison reflects Gorgias&apos; public Starter plan as of
                    this writing. Always verify on their site for current
                    details.
                </p>
            </Container>
        </Section>

        <Section bg="warm">
            <Container narrow>
                <SectionHead
                    eyebrow="The math"
                    title='What "just the WISMO problem" costs each way.'
                />
                <p
                    style={{
                        textAlign: "center",
                        color: "var(--color-neutral)",
                        marginBottom: 32,
                    }}
                >
                    Modeled for a store with ~2,000 support emails per month,
                    ~60% of them WISMO.
                </p>
                <div className="grid gap-5 md:grid-cols-2">
                    <div className={cardClass} style={{ padding: 28 }}>
                        <h4 style={{ marginBottom: 10 }}>With Gorgias</h4>
                        <div
                            style={{
                                fontSize: 14,
                                color: "var(--color-base-content)",
                                display: "flex",
                                flexDirection: "column",
                                gap: 10,
                            }}
                        >
                            {[
                                ["Base plan (Starter)", "$60/mo"],
                                [
                                    "Setup time (one-off, your hours)",
                                    "~6 hours",
                                ],
                                ["Maintenance (rules, macros)", "~1 hr/mo"],
                            ].map(([k, v]) => (
                                <div
                                    key={k}
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <span>{k}</span>
                                    <strong>{v}</strong>
                                </div>
                            ))}
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    paddingTop: 10,
                                    borderTop:
                                        "1px solid var(--color-base-300)",
                                }}
                            >
                                <span>Monthly cost</span>
                                <strong>$60+</strong>
                            </div>
                        </div>
                        <p
                            style={{
                                fontSize: 13,
                                color: "var(--color-neutral)",
                                marginTop: 14,
                            }}
                        >
                            Worth it if you&apos;ll use the rest of the
                            helpdesk. Probably not if you only want WISMO
                            solved.
                        </p>
                    </div>
                    <div
                        className={cardClass}
                        style={{
                            padding: 28,
                            background: "var(--color-base-200)",
                            borderColor: "#b8edcb",
                        }}
                    >
                        <h4 style={{ marginBottom: 10 }}>With Valyn</h4>
                        <div
                            style={{
                                fontSize: 14,
                                color: "var(--color-base-content)",
                                display: "flex",
                                flexDirection: "column",
                                gap: 10,
                            }}
                        >
                            {[
                                ["Pro plan", "$49/mo"],
                                ["Setup time (one-off, your hours)", "~5 min"],
                                ["Maintenance", "~0"],
                            ].map(([k, v]) => (
                                <div
                                    key={k}
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <span>{k}</span>
                                    <strong>{v}</strong>
                                </div>
                            ))}
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    paddingTop: 10,
                                    borderTop: "1px solid #b8edcb",
                                }}
                            >
                                <span>Monthly cost</span>
                                <strong>$49</strong>
                            </div>
                        </div>
                        <p
                            style={{
                                fontSize: 13,
                                color: "var(--color-base-content)",
                                marginTop: 14,
                            }}
                        >
                            Worth it the moment you spend an hour a week
                            answering tracking emails.
                        </p>
                    </div>
                </div>
            </Container>
        </Section>

        <FinalCta
            title="Try Valyn before you buy a helpdesk."
            description="7-day free trial. If WISMO automation alone solves your problem, you don't need anything bigger."
            secondaryHref="/pricing"
            secondaryLabel="See pricing"
        />

        <PublicFooter />
    </>
);

export default Page;
