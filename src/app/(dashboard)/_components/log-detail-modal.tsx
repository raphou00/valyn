"use client";

import { useEffect, useState } from "react";
import {
    Badge,
    Banner,
    BlockStack,
    Box,
    Button,
    InlineStack,
    Modal,
    Spinner,
    Text,
} from "@shopify/polaris";
import { useAuthedFetch } from "../_lib/use-authed-fetch";

type LogDetail = {
    id: string;
    senderEmail: string;
    subject: string;
    body: string;
    intent: "WISMO" | "OTHER";
    status: string;
    orderId: string | null;
    orderName: string | null;
    errorMessage: string | null;
    replyPreview: string | null;
    receivedAt: string;
    repliedAt: string | null;
    confidence: number | null;
    detectedLanguage: string | null;
    detectionReason: string | null;
    retryCount: number;
    lastRetryAt: string | null;
    reviewedAt: string | null;
    manuallyMarked: boolean;
};

type Caps = { oneClickRetry: boolean; manualReviewMode: boolean };

const LogDetailModal: React.FC<{
    open: boolean;
    logId: string | null;
    caps: Caps;
    onClose: () => void;
    onChanged: () => void;
}> = ({ open, logId, caps, onClose, onChanged }) => {
    const authedFetch = useAuthedFetch();
    const [loading, setLoading] = useState(false);
    const [acting, setActing] = useState<string | null>(null);
    const [log, setLog] = useState<LogDetail | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [notice, setNotice] = useState<string | null>(null);

    useEffect(() => {
        if (!open || !logId) return;
        let cancelled = false;
        setLoading(true);
        setLog(null);
        setError(null);
        setNotice(null);
        (async () => {
            try {
                const res = await authedFetch(
                    `/api/internal/logs/${encodeURIComponent(logId)}`
                );
                if (!res.ok) throw new Error(`load ${res.status}`);
                const data = (await res.json()) as { log: LogDetail };
                if (!cancelled) setLog(data.log);
            } catch (e) {
                if (!cancelled) setError((e as Error).message);
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [authedFetch, open, logId]);

    const act = async (action: "retry" | "approve" | "mark-misclassified") => {
        if (!logId) return;
        setActing(action);
        setError(null);
        setNotice(null);
        try {
            const res = await authedFetch(
                `/api/internal/logs/${encodeURIComponent(logId)}/${action}`,
                { method: "POST" }
            );
            const data = (await res.json()) as {
                outcome?: { status: string; error?: string };
                message?: string;
            };
            if (!res.ok) {
                throw new Error(data.message ?? `failed (${res.status})`);
            }
            if (data.outcome?.status === "FAILED") {
                setError(data.outcome.error ?? "send failed");
            } else {
                setNotice("Done.");
            }
            onChanged();
        } catch (e) {
            setError((e as Error).message);
        } finally {
            setActing(null);
        }
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            title={log?.subject ?? "Email"}
            size="large"
        >
            <Modal.Section>
                {loading && !log ?
                    <InlineStack align="center" blockAlign="center">
                        <Box padding="600">
                            <Spinner accessibilityLabel="Loading" />
                        </Box>
                    </InlineStack>
                : log ?
                    <BlockStack gap="400">
                        {error && (
                            <Banner tone="critical" title="Action failed">
                                <p>{error}</p>
                            </Banner>
                        )}
                        {notice && <Banner tone="success" title={notice} />}

                        <BlockStack gap="100">
                            <InlineStack gap="200" blockAlign="center">
                                <Badge tone="info">{log.intent}</Badge>
                                <Badge>{log.status}</Badge>
                                {log.detectedLanguage && (
                                    <Badge>{`Lang: ${log.detectedLanguage.toUpperCase()}`}</Badge>
                                )}
                                {log.confidence !== null && (
                                    <Text
                                        as="span"
                                        variant="bodySm"
                                        tone="subdued"
                                    >
                                        Confidence{" "}
                                        {(log.confidence * 100).toFixed(0)}%
                                    </Text>
                                )}
                            </InlineStack>
                            <Text as="p" tone="subdued" variant="bodySm">
                                From {log.senderEmail} —{" "}
                                {new Date(log.receivedAt).toLocaleString()}
                            </Text>
                            {log.orderName && (
                                <Text as="p" variant="bodySm">
                                    Order: <strong>{log.orderName}</strong>
                                </Text>
                            )}
                            {log.detectionReason && (
                                <Text as="p" variant="bodySm" tone="subdued">
                                    Detection: {log.detectionReason}
                                </Text>
                            )}
                            {log.errorMessage && (
                                <Text as="p" tone="critical" variant="bodySm">
                                    {log.errorMessage}
                                </Text>
                            )}
                            {log.retryCount > 0 && (
                                <Text as="p" variant="bodySm" tone="subdued">
                                    Retried {log.retryCount} time(s)
                                    {log.lastRetryAt && (
                                        <>
                                            {" "}
                                            (last{" "}
                                            {new Date(
                                                log.lastRetryAt
                                            ).toLocaleString()}
                                            )
                                        </>
                                    )}
                                </Text>
                            )}
                        </BlockStack>

                        <Box
                            padding="300"
                            background="bg-surface-secondary"
                            borderRadius="200"
                        >
                            <Text as="h3" variant="headingSm">
                                Customer email
                            </Text>
                            <Box paddingBlockStart="200">
                                <Text as="p" variant="bodyMd" breakWord>
                                    <span style={{ whiteSpace: "pre-wrap" }}>
                                        {log.body || "(empty body)"}
                                    </span>
                                </Text>
                            </Box>
                        </Box>

                        {log.replyPreview && (
                            <Box
                                padding="300"
                                background="bg-surface-success"
                                borderRadius="200"
                            >
                                <Text as="h3" variant="headingSm">
                                    Reply sent
                                </Text>
                                <Box paddingBlockStart="200">
                                    <Text as="p" variant="bodyMd" breakWord>
                                        <span
                                            style={{ whiteSpace: "pre-wrap" }}
                                        >
                                            {log.replyPreview}
                                        </span>
                                    </Text>
                                </Box>
                                {log.repliedAt && (
                                    <Box paddingBlockStart="200">
                                        <Text
                                            as="p"
                                            variant="bodySm"
                                            tone="subdued"
                                        >
                                            Sent{" "}
                                            {new Date(
                                                log.repliedAt
                                            ).toLocaleString()}
                                        </Text>
                                    </Box>
                                )}
                            </Box>
                        )}

                        <InlineStack gap="200" align="end" wrap>
                            {caps.oneClickRetry &&
                                (log.status === "FAILED" ||
                                    log.status === "REVIEW") && (
                                    <Button
                                        loading={acting === "retry"}
                                        onClick={() => act("retry")}
                                    >
                                        Retry send
                                    </Button>
                                )}
                            {caps.manualReviewMode &&
                                log.status === "REVIEW" && (
                                    <Button
                                        variant="primary"
                                        loading={acting === "approve"}
                                        onClick={() => act("approve")}
                                    >
                                        Approve & send
                                    </Button>
                                )}
                            {(log.status === "REPLIED" ||
                                log.status === "REVIEW") && (
                                <Button
                                    tone="critical"
                                    variant="plain"
                                    loading={acting === "mark-misclassified"}
                                    onClick={() => act("mark-misclassified")}
                                >
                                    Mark misclassified
                                </Button>
                            )}
                        </InlineStack>
                    </BlockStack>
                : error ?
                    <Banner tone="critical" title="Failed to load">
                        <p>{error}</p>
                    </Banner>
                :   null}
            </Modal.Section>
        </Modal>
    );
};

export default LogDetailModal;
