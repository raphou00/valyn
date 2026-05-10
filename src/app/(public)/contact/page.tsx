import type { Metadata } from "next";
import {
    Container,
    FinalCta,
    PageHero,
    Section,
} from "../_components/site-shell";
import { SUPPORT_EMAIL, marketingMetadata } from "../_lib/metadata";

export const metadata: Metadata = marketingMetadata({
    title: "Contact Valyn",
    description:
        "Contact Valyn for Shopify app support, app installation questions, privacy requests, and merchant support.",
    path: "/contact",
});

const Page = () => (
    <>
        <PageHero
            eyebrow="Contact"
            title="Talk to Valyn support."
            description="Questions about installation, setup, billing, privacy, or Shopify App Store review support can start here."
        />
        <Section className="bg-base-200">
            <Container>
                <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
                    <div className="space-y-5">
                        <div className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
                            <h2 className="text-2xl font-bold text-slate-950">
                                Support email
                            </h2>
                            <a
                                className="link link-primary mt-3 inline-block"
                                href={`mailto:${SUPPORT_EMAIL}`}
                            >
                                {SUPPORT_EMAIL}
                            </a>
                        </div>
                        <div className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
                            <h2 className="text-2xl font-bold text-slate-950">
                                Response expectations
                            </h2>
                            <p className="mt-3 text-slate-700">
                                Merchant support requests are reviewed during
                                business hours. Urgent privacy or security
                                questions should use the support email above.
                            </p>
                        </div>
                        <div className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
                            <h2 className="text-2xl font-bold text-slate-950">
                                Company and legal identity
                            </h2>
                            <p className="mt-3 text-slate-700">
                                Company legal details should be finalized before
                                public launch and Shopify App Store submission.
                            </p>
                        </div>
                    </div>
                    <form
                        action={`mailto:${SUPPORT_EMAIL}`}
                        className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm"
                        encType="text/plain"
                        method="post"
                    >
                        <h2 className="text-2xl font-bold text-slate-950">
                            Contact form
                        </h2>
                        <div className="mt-6 grid gap-4">
                            <label className="form-control">
                                <span className="label-text">Name</span>
                                <input
                                    className="input input-bordered"
                                    name="name"
                                    required
                                />
                            </label>
                            <label className="form-control">
                                <span className="label-text">Email</span>
                                <input
                                    className="input input-bordered"
                                    name="email"
                                    required
                                    type="email"
                                />
                            </label>
                            <label className="form-control">
                                <span className="label-text">Store URL</span>
                                <input
                                    className="input input-bordered"
                                    name="store"
                                    placeholder="your-store.myshopify.com"
                                />
                            </label>
                            <label className="form-control">
                                <span className="label-text">Message</span>
                                <textarea
                                    className="textarea textarea-bordered min-h-36"
                                    name="message"
                                    required
                                />
                            </label>
                            <button className="btn btn-primary" type="submit">
                                Send message
                            </button>
                        </div>
                    </form>
                </div>
            </Container>
        </Section>
        <FinalCta />
    </>
);

export default Page;
