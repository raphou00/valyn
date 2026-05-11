import type { Metadata } from "next";
import {
    Container,
    FinalCta,
    PageHead,
    PublicFooter,
    PublicHeader,
    Section,
} from "../_components/site-shell";
import { marketingMetadata, SUPPORT_EMAIL } from "../_lib/metadata";

export const metadata: Metadata = marketingMetadata({
    title: "Contact Valyn",
    description:
        "Contact Valyn for Shopify app support, app installation questions, privacy requests, and merchant support.",
    path: "/contact",
});

const Page = () => (
    <>
        <PublicHeader />
        <PageHead
            eyebrow="Contact"
            title="Talk to Valyn support."
            description="Questions about installation, setup, billing, privacy, or Shopify App Store review support can start here."
        />
        <Section bg="soft">
            <Container>
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "0.8fr 1.2fr",
                        gap: 32,
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 18,
                        }}
                    >
                        <div className="card">
                            <h3>Support email</h3>
                            <a
                                href={`mailto:${SUPPORT_EMAIL}`}
                                style={{
                                    marginTop: 12,
                                    display: "inline-block",
                                    color: "var(--green-deep)",
                                    fontWeight: 540,
                                }}
                            >
                                {SUPPORT_EMAIL}
                            </a>
                        </div>
                        <div className="card">
                            <h3>Response expectations</h3>
                            <p style={{ marginTop: 12 }}>
                                Merchant support requests are reviewed during
                                business hours. Urgent privacy or security
                                questions should use the support email above.
                            </p>
                        </div>
                        <div className="card">
                            <h3>Company &amp; legal identity</h3>
                            <p style={{ marginTop: 12 }}>
                                Company legal details should be finalized
                                before public launch and Shopify App Store
                                submission.
                            </p>
                        </div>
                    </div>
                    <form
                        action={`mailto:${SUPPORT_EMAIL}`}
                        method="post"
                        encType="text/plain"
                        className="card"
                    >
                        <h3>Contact form</h3>
                        <div
                            style={{
                                marginTop: 18,
                                display: "grid",
                                gap: 14,
                            }}
                        >
                            <label
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 6,
                                    fontSize: 14,
                                    color: "var(--ink-2)",
                                }}
                            >
                                <span>Name</span>
                                <input
                                    name="name"
                                    required
                                    style={{
                                        padding: "10px 12px",
                                        border: "1px solid var(--line)",
                                        borderRadius: 8,
                                        fontFamily: "inherit",
                                        fontSize: 14,
                                    }}
                                />
                            </label>
                            <label
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 6,
                                    fontSize: 14,
                                    color: "var(--ink-2)",
                                }}
                            >
                                <span>Email</span>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    style={{
                                        padding: "10px 12px",
                                        border: "1px solid var(--line)",
                                        borderRadius: 8,
                                        fontFamily: "inherit",
                                        fontSize: 14,
                                    }}
                                />
                            </label>
                            <label
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 6,
                                    fontSize: 14,
                                    color: "var(--ink-2)",
                                }}
                            >
                                <span>Store URL</span>
                                <input
                                    name="store"
                                    placeholder="your-store.myshopify.com"
                                    style={{
                                        padding: "10px 12px",
                                        border: "1px solid var(--line)",
                                        borderRadius: 8,
                                        fontFamily: "inherit",
                                        fontSize: 14,
                                    }}
                                />
                            </label>
                            <label
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 6,
                                    fontSize: 14,
                                    color: "var(--ink-2)",
                                }}
                            >
                                <span>Message</span>
                                <textarea
                                    name="message"
                                    required
                                    rows={6}
                                    style={{
                                        padding: "10px 12px",
                                        border: "1px solid var(--line)",
                                        borderRadius: 8,
                                        fontFamily: "inherit",
                                        fontSize: 14,
                                        resize: "vertical",
                                    }}
                                />
                            </label>
                            <button
                                type="submit"
                                className="btn btn-green"
                                style={{ justifyContent: "center" }}
                            >
                                Send message
                            </button>
                        </div>
                    </form>
                </div>
            </Container>
        </Section>
        <FinalCta />
        <PublicFooter />
    </>
);

export default Page;
