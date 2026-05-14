"use client";

import { useEffect, useState } from "react";
import {
    Banner,
    BlockStack,
    Box,
    InlineStack,
    Modal,
    Spinner,
    Text,
} from "@shopify/polaris";
import { useAuthedFetch } from "../_lib/use-authed-fetch";

type Preview = {
    subject: string;
    body: string;
    orderName: string | null;
    carrier: string | null;
    tracking: string | null;
    language: string;
    type: string;
};

type Props = {
    open: boolean;
    onClose: () => void;
};

const TestEmailModal: React.FC<Props> = ({ open, onClose }) => {
    const authedFetch = useAuthedFetch();
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState<Preview | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!open) return;
        let cancelled = false;
        setLoading(true);
        setPreview(null);
        setError(null);
        (async () => {
            try {
                const res = await authedFetch("/api/internal/test-email", {
                    method: "POST",
                });
                const data = (await res.json()) as {
                    ok: boolean;
                    preview?: Preview;
                    message?: string;
                };
                if (cancelled) return;
                if (!data.ok || !data.preview) {
                    setError(
                        data.message ?? "Couldn't generate a test reply."
                    );
                } else {
                    setPreview(data.preview);
                }
            } catch (e) {
                if (!cancelled) setError((e as Error).message);
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [open, authedFetch]);

    return (
        <Modal
            open={open}
            onClose={onClose}
            title="Test reply preview"
            primaryAction={{ content: "Close", onAction: onClose }}
        >
            <Modal.Section>
                {loading ?
                    <InlineStack align="center">
                        <Box padding="400">
                            <Spinner accessibilityLabel="Generating preview" />
                        </Box>
                    </InlineStack>
                : error ?
                    <Banner tone="critical" title="Couldn't run the test">
                        <p>{error}</p>
                    </Banner>
                : preview ?
                    <BlockStack gap="300">
                        <Text as="p" tone="subdued" variant="bodySm">
                            This is the reply Valyn would send if a customer
                            asked &quot;where is my order?&quot; right now —
                            using your most recent order.
                        </Text>
                        {!preview.orderName && (
                            <Banner tone="warning">
                                <p>
                                    No orders found in this store yet. The
                                    preview shows the &quot;no order
                                    matched&quot; reply.
                                </p>
                            </Banner>
                        )}
                        <Box
                            background="bg-surface-secondary"
                            padding="400"
                            borderRadius="200"
                        >
                            <BlockStack gap="200">
                                <Text as="p" variant="bodySm" tone="subdued">
                                    Subject
                                </Text>
                                <Text as="p" variant="bodyMd" fontWeight="medium">
                                    {preview.subject}
                                </Text>
                                <Box paddingBlockStart="200">
                                    <Text as="p" variant="bodySm" tone="subdued">
                                        Body
                                    </Text>
                                </Box>
                                <pre
                                    style={{
                                        whiteSpace: "pre-wrap",
                                        fontFamily: "inherit",
                                        margin: 0,
                                    }}
                                >
                                    {preview.body}
                                </pre>
                            </BlockStack>
                        </Box>
                        {preview.orderName && (
                            <Text as="p" tone="subdued" variant="bodySm">
                                Matched order {preview.orderName}
                                {preview.carrier && ` · ${preview.carrier}`}
                                {preview.tracking && ` · ${preview.tracking}`}
                            </Text>
                        )}
                    </BlockStack>
                :   null}
            </Modal.Section>
        </Modal>
    );
};

export default TestEmailModal;
