import type { Metadata } from "next";
import {
    cardClass,
    Container,
    FinalCta,
    PageHead,
    PublicFooter,
    PublicHeader,
    Section,
} from "../_components/site-shell";
import { marketingMetadata, SUPPORT_EMAIL } from "../_lib/metadata";

export const metadata: Metadata = marketingMetadata({
    title: "Contact Valyn — Shopify app support &amp; questions",
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
                <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
                    <div className="grid gap-[18px]">
                        <div className={cardClass}>
                            <h3>Support email</h3>
                            <a
                                href={`mailto:${SUPPORT_EMAIL}`}
                                className="mt-3 inline-block font-medium text-base-content"
                            >
                                {SUPPORT_EMAIL}
                            </a>
                        </div>
                        <div className={cardClass}>
                            <h3>Response expectations</h3>
                            <p>
                                Merchant support requests are reviewed during
                                business hours. Urgent privacy or security
                                questions should use the support email above.
                            </p>
                        </div>
                        <div className={cardClass}>
                            <h3>Company &amp; legal identity</h3>
                            <p>
                                Company legal details should be finalized before
                                public launch and Shopify App Store submission.
                            </p>
                        </div>
                    </div>
                    <form
                        action={`mailto:${SUPPORT_EMAIL}`}
                        method="post"
                        encType="text/plain"
                        className={cardClass}
                    >
                        <h3>Contact form</h3>
                        <div className="mt-[18px] grid gap-3.5">
                            <label className="grid gap-1.5 text-sm text-base-content">
                                <span>Name</span>
                                <input
                                    name="name"
                                    required
                                    className="input input-bordered w-full"
                                />
                            </label>
                            <label className="grid gap-1.5 text-sm text-base-content">
                                <span>Email</span>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    className="input input-bordered w-full"
                                />
                            </label>
                            <label className="grid gap-1.5 text-sm text-base-content">
                                <span>Store URL</span>
                                <input
                                    name="store"
                                    placeholder="your-store.myshopify.com"
                                    className="input input-bordered w-full"
                                />
                            </label>
                            <label className="grid gap-1.5 text-sm text-base-content">
                                <span>Message</span>
                                <textarea
                                    name="message"
                                    required
                                    rows={6}
                                    className="textarea textarea-bordered w-full resize-y"
                                />
                            </label>
                            <button
                                type="submit"
                                className="btn btn-primary justify-center"
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
