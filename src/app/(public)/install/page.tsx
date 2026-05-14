import type { Metadata } from "next";
import Link from "next/link";
import {
    cardClass,
    Container,
    PageHead,
    PublicFooter,
    PublicHeader,
    Section,
} from "../_components/site-shell";
import { ShopifyBox } from "../_components/icons";
import { marketingMetadata } from "../_lib/metadata";

export const metadata: Metadata = marketingMetadata({
    title: "Install Valyn on your Shopify store",
    description:
        "Enter your Shopify store domain to install Valyn. Read-only OAuth, 7-day free trial, cancel any time.",
    path: "/install",
});

const nextSteps = [
    {
        n: 1,
        title: "Shopify OAuth",
        body: "We redirect you to Shopify to grant read-only access to orders, fulfillments, and customers. No write scopes.",
    },
    {
        n: 2,
        title: "Pick a plan",
        body: "Starter or Pro, both with a 7-day free trial billed through Shopify. Switch any time from the dashboard.",
    },
    {
        n: 3,
        title: "Configure SMTP & forward",
        body: "Add your outgoing SMTP credentials and forward your support inbox to your Valyn address. You're live.",
    },
];

const scopes = [
    {
        scope: "read_orders",
        body: "Look up the order a customer is asking about, by order number, sender email, or recency.",
    },
    {
        scope: "read_fulfillments",
        body: "Read the carrier and tracking number to include in the auto-reply.",
    },
    {
        scope: "read_customers",
        body: "Match the inbound sender to a customer on file when the order number is missing.",
    },
];

const Page = () => (
    <>
        <PublicHeader />
        <PageHead
            eyebrow="Install"
            title="Install Valyn on your Shopify store."
            description="Enter your store domain to start the OAuth flow. The whole setup takes under two minutes."
        />

        <Section>
            <Container narrow>
                <div className="rounded-xl border border-base-300 bg-base-100 p-6 shadow-[0_8px_8px_rgba(0,0,0,0.08),0_4px_4px_rgba(0,0,0,0.06),0_2px_2px_rgba(0,0,0,0.05)] sm:p-10">
                    <form
                        action="/api/auth"
                        method="get"
                        className="grid gap-3"
                    >
                        <label
                            htmlFor="shop"
                            className="text-sm font-medium text-base-content"
                        >
                            Your Shopify store domain
                        </label>
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <input
                                id="shop"
                                name="shop"
                                required
                                autoFocus
                                autoComplete="off"
                                spellCheck={false}
                                placeholder="your-store.myshopify.com"
                                aria-label="Shopify store domain"
                                pattern="[a-z0-9][a-z0-9\-]*\.myshopify\.com"
                                title="Use the full domain, e.g. your-store.myshopify.com"
                                className="input input-lg input-bordered w-full"
                            />
                            <button
                                type="submit"
                                className="btn btn-primary btn-lg shrink-0"
                            >
                                <ShopifyBox className="size-4 shrink-0" />
                                Install on Shopify
                            </button>
                        </div>
                        <p className="text-sm text-base-content/60">
                            Must end in <code>.myshopify.com</code>. You can
                            find it in Shopify admin → Settings → Domains.
                        </p>
                    </form>
                </div>

                <p className="mt-5 text-center text-sm text-base-content/60">
                    Prefer to find us on the Shopify App Store? We&apos;ll link
                    here once listed.
                </p>
            </Container>
        </Section>

        <Section bg="soft">
            <Container>
                <div className="grid gap-5 md:grid-cols-3">
                    {nextSteps.map((s) => (
                        <div className={cardClass} key={s.n}>
                            <div className="mb-4 text-sm font-medium text-base-content/50">
                                0{s.n}
                            </div>
                            <h3>{s.title}</h3>
                            <p>{s.body}</p>
                        </div>
                    ))}
                </div>
            </Container>
        </Section>

        <Section>
            <Container narrow>
                <h2 className="text-3xl font-[330] leading-tight text-base-content sm:text-4xl">
                    Read-only permissions, nothing more.
                </h2>
                <p className="mt-4 text-base leading-7 text-base-content/70">
                    Valyn requests the minimum Shopify scopes needed to look up
                    an order and reply. It never modifies your store, your
                    customers, or your checkout.
                </p>
                <ul className="mt-7 grid gap-3.5">
                    {scopes.map((s) => (
                        <li
                            key={s.scope}
                            className="rounded-lg border border-base-300 bg-base-100 p-5"
                        >
                            <code className="text-sm font-medium text-base-content">
                                {s.scope}
                            </code>
                            <p className="mt-2 text-sm leading-6 text-base-content/70">
                                {s.body}
                            </p>
                        </li>
                    ))}
                </ul>
                <div className="mt-9 flex flex-wrap gap-3 text-sm">
                    <Link href="/pricing" className="btn btn-ghost btn-sm">
                        See pricing
                    </Link>
                    <Link
                        href="/legal/security"
                        className="btn btn-ghost btn-sm"
                    >
                        Security & data handling
                    </Link>
                    <Link href="/contact" className="btn btn-ghost btn-sm">
                        Questions? Contact us
                    </Link>
                </div>
            </Container>
        </Section>

        <PublicFooter />
    </>
);

export default Page;
