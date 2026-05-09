export const metadata = { title: "Terms of Service — Valyn" };

const Page = () => {
    return (
        <article>
            <h1>Terms of Service</h1>
            <p>
                <em>
                    Last updated: REPLACE_DATE. This is a starter draft —
                    have it reviewed by counsel before submitting to the
                    Shopify App Store.
                </em>
            </p>

            <h2>Acceptance</h2>
            <p>
                By installing or using Valyn (&quot;the Service&quot;) on
                your Shopify store, you agree to these Terms.
            </p>

            <h2>Service description</h2>
            <p>
                Valyn detects tracking-related emails forwarded by you and
                automatically replies on your behalf using your own SMTP
                credentials and your own greeting/signature.
            </p>

            <h2>Your responsibilities</h2>
            <ul>
                <li>
                    Provide accurate SMTP credentials and the right to send
                    on behalf of the configured From address.
                </li>
                <li>
                    Forward only emails you have the right to forward to a
                    third-party processor.
                </li>
                <li>Maintain an active subscription to use the Service.</li>
            </ul>

            <h2>Subscription &amp; billing</h2>
            <p>
                Billing is handled by Shopify under the Pro plan
                (USD 19/month after a 14-day trial). You can cancel at any
                time from your Shopify admin; cancellation takes effect at
                the end of the current billing period.
            </p>

            <h2>Disclaimer</h2>
            <p>
                The Service is provided &quot;as is&quot;. We do not
                guarantee that automated replies will be accurate in every
                case. You remain responsible for the customer relationship.
            </p>

            <h2>Limitation of liability</h2>
            <p>
                To the maximum extent permitted by law, our total liability
                in any twelve-month period is capped at the fees you paid
                during that period.
            </p>

            <h2>Termination</h2>
            <p>
                Uninstalling the app from your Shopify admin terminates
                these Terms. Within 48 hours, all associated data is
                deleted as described in our{" "}
                <a href="/privacy">Privacy Policy</a>.
            </p>

            <h2>Contact</h2>
            <p>
                <a href="mailto:REPLACE_SUPPORT_EMAIL">
                    REPLACE_SUPPORT_EMAIL
                </a>
            </p>
        </article>
    );
};

export default Page;
