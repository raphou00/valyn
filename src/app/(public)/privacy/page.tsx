export const metadata = { title: "Privacy Policy — Valyn" };

const Page = () => {
    return (
        <article>
            <h1>Privacy Policy</h1>
            <p>
                <em>
                    Last updated: REPLACE_DATE. This is a starter draft — have
                    it reviewed by counsel before submitting to the Shopify App
                    Store.
                </em>
            </p>

            <h2>Who we are</h2>
            <p>
                Valyn (&quot;we&quot;, &quot;us&quot;) provides an embedded
                Shopify application that detects tracking-related customer
                emails and sends automated replies on behalf of merchants.
            </p>

            <h2>Data we collect</h2>
            <ul>
                <li>
                    <strong>Shop data</strong> from the Shopify Admin API: shop
                    domain, OAuth access token, granted scopes, order metadata
                    (id, name, fulfillment status, tracking information)
                    requested only when a relevant inbound email arrives.
                </li>
                <li>
                    <strong>Inbound email data</strong>: the sender address,
                    subject line, body, and timestamp of emails forwarded by
                    merchants to our intake address.
                </li>
                <li>
                    <strong>Settings</strong>: SMTP credentials (encrypted at
                    rest with AES-256-GCM), greeting/signature text, language
                    and tone preferences.
                </li>
            </ul>

            <h2>How we use it</h2>
            <ul>
                <li>To classify emails and identify the related order.</li>
                <li>
                    To send automated replies through the merchant&apos;s own
                    SMTP server.
                </li>
                <li>To display logs and statistics to the merchant.</li>
            </ul>

            <h2>Data retention</h2>
            <ul>
                <li>
                    Raw inbound MIME files are retained in S3 for 30 days then
                    automatically expired.
                </li>
                <li>
                    Email logs are retained for the lifetime of the
                    installation.
                </li>
                <li>
                    On app uninstall, Shopify triggers our
                    <code> shop/redact</code> webhook 48 hours later; all
                    associated data is deleted at that point.
                </li>
                <li>
                    Customer-specific data is deleted on receipt of the Shopify{" "}
                    <code>customers/redact</code> webhook.
                </li>
            </ul>

            <h2>Sub-processors</h2>
            <ul>
                <li>Render (application hosting)</li>
                <li>Amazon Web Services (S3, SNS, SES, DynamoDB)</li>
                <li>Shopify (platform integration)</li>
            </ul>

            <h2>Contact</h2>
            <p>
                Questions or data requests:{" "}
                <a href="mailto:REPLACE_SUPPORT_EMAIL">REPLACE_SUPPORT_EMAIL</a>
                .
            </p>
        </article>
    );
};

export default Page;
