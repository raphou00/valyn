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
import DemoStage from "../_components/demo-stage";
import { Mailbox, Search, Send } from "../_components/icons";
import { marketingMetadata } from "../_lib/metadata";

export const metadata: Metadata = marketingMetadata({
    title: "Demo — See Valyn handle a real WISMO email",
    description:
        "See how Valyn detects a Shopify order tracking email, looks up the order, and replies in under 5 seconds.",
    path: "/demo",
});

const Page = () => (
    <>
        <PublicHeader active="demo" />

        <PageHead
            eyebrow="Live demo"
            title={
                <>
                    Watch Valyn handle one email,
                    <br />
                    start to finish.
                </>
            }
            description="No signup. No install. Step through the real pipeline a Shopify merchant sees — from forwarded customer email to delivered reply."
        />

        <Section>
            <Container>
                <DemoStage />
            </Container>
        </Section>

        <Section bg="soft" style={{ paddingTop: 0 }}>
            <Container>
                <SectionHead
                    eyebrow="Under the hood"
                    title="What happens between forward and reply."
                />
                <div className="grid-3">
                    <div className="card">
                        <div className="ico-box">
                            <Mailbox />
                        </div>
                        <h3>SES inbound</h3>
                        <p>
                            Your forwarding address is an AWS SES route.
                            Inbound MIME lands in S3, an SNS topic kicks off
                            the pipeline.
                        </p>
                    </div>
                    <div className="card">
                        <div className="ico-box">
                            <Search />
                        </div>
                        <h3>Detect &amp; identify</h3>
                        <p>
                            Keyword classifier tags WISMO. Order lookup hits
                            Shopify Admin GraphQL with order-number → email
                            → recent-order priority.
                        </p>
                    </div>
                    <div className="card">
                        <div className="ico-box">
                            <Send />
                        </div>
                        <h3>Reply via your SMTP</h3>
                        <p>
                            nodemailer signs and sends from your domain.
                            Reply is logged with full envelope and links back
                            to the source email.
                        </p>
                    </div>
                </div>
            </Container>
        </Section>

        <FinalCta
            title="Want this running on your store?"
            description="Install Valyn and have your first auto-reply going out in under 5 minutes."
            secondaryHref="/pricing"
            secondaryLabel="See pricing"
        />

        <PublicFooter />
    </>
);

export default Page;
