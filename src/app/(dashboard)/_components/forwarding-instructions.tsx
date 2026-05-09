"use client";

import { useState } from "react";
import {
    BlockStack,
    Box,
    Button,
    Card,
    InlineStack,
    Link,
    List,
    Tabs,
    Text,
} from "@shopify/polaris";

type Props = {
    inboundAddress: string | null;
};

const ForwardingInstructions: React.FC<Props> = ({ inboundAddress }) => {
    const [selected, setSelected] = useState(0);
    const [copied, setCopied] = useState(false);

    const onCopy = async () => {
        if (!inboundAddress) return;
        await navigator.clipboard.writeText(inboundAddress);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    if (!inboundAddress) {
        return (
            <Card>
                <Text as="p" tone="subdued">
                    Forwarding address not provisioned yet.
                </Text>
            </Card>
        );
    }

    const tabs = [
        { id: "gmail", content: "Gmail" },
        { id: "outlook", content: "Outlook" },
        { id: "helpscout", content: "Help Scout" },
        { id: "other", content: "Other" },
    ];

    const panels: React.ReactNode[] = [
        <List type="number" key="gmail">
            <List.Item>
                In Gmail, open{" "}
                <strong>
                    Settings → See all settings → Forwarding and POP/IMAP
                </strong>
                .
            </List.Item>
            <List.Item>
                Click <strong>Add a forwarding address</strong> and paste the
                address above.
            </List.Item>
            <List.Item>
                Open the verification email Gmail sends — it lands in your Email
                log here. Copy the confirmation link and visit it.
            </List.Item>
            <List.Item>
                Back in Gmail, choose{" "}
                <strong>Forward a copy of incoming mail to</strong> → select
                your forwarding address.
            </List.Item>
        </List>,
        <List type="number" key="outlook">
            <List.Item>
                In Outlook, open <strong>Settings → Mail → Forwarding</strong>.
            </List.Item>
            <List.Item>
                Enable forwarding and paste the address above.
            </List.Item>
            <List.Item>
                Check <strong>Keep a copy of forwarded messages</strong> so your
                support archive stays intact.
            </List.Item>
        </List>,
        <List type="number" key="helpscout">
            <List.Item>
                Open your Help Scout mailbox settings →{" "}
                <strong>Mailbox → Forwarding Address</strong>.
            </List.Item>
            <List.Item>
                Add the address above as an outbound forward, then create a
                workflow that forwards every conversation to it.
            </List.Item>
        </List>,
        <List type="number" key="other">
            <List.Item>
                Wherever your support mail arrives, configure a server-side
                forward rule for the address above.
            </List.Item>
            <List.Item>
                Make sure the original sender&apos;s address is preserved in the{" "}
                <code>From:</code> header — Valyn replies to that address.
            </List.Item>
            <List.Item>
                Need help?{" "}
                <Link url="mailto:support@example.com">Email support</Link>.
            </List.Item>
        </List>,
    ];

    return (
        <Card>
            <BlockStack gap="300">
                <Text as="h3" variant="headingSm">
                    Forwarding address
                </Text>
                <InlineStack
                    gap="200"
                    align="space-between"
                    blockAlign="center"
                >
                    <Text as="p" variant="headingMd">
                        {inboundAddress}
                    </Text>
                    <Button onClick={onCopy} variant="secondary">
                        {copied ? "Copied" : "Copy"}
                    </Button>
                </InlineStack>
                <Box paddingBlockStart="200">
                    <Tabs
                        tabs={tabs}
                        selected={selected}
                        onSelect={setSelected}
                    >
                        <Box paddingBlockStart="300">{panels[selected]}</Box>
                    </Tabs>
                </Box>
            </BlockStack>
        </Card>
    );
};

export default ForwardingInstructions;
