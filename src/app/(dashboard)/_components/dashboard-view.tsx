"use client";

import { useCallback, useEffect, useState } from "react";
import {
    Badge,
    Banner,
    BlockStack,
    Card,
    EmptyState,
    InlineGrid,
    InlineStack,
    Pagination,
    Spinner,
    Text,
    type BadgeProps,
} from "@shopify/polaris";
import { useAuthedFetch } from "../_lib/use-authed-fetch";
import BillingBanner from "./billing-banner";

type Stats = {
    total: number;
    wismo: number;
    replied: number;
    failed: number;
};

type SubscriptionState = {
    status:
        | "PENDING"
        | "ACTIVE"
        | "CANCELLED"
        | "DECLINED"
        | "EXPIRED"
        | "FROZEN"
        | null;
    trialEndsOn: string | null;
    currentPeriodEnd: string | null;
};

type LogRow = {
    id: string;
    senderEmail: string;
    subject: string;
    intent: "WISMO" | "OTHER";
    status: "REPLIED" | "FAILED" | "IGNORED" | "PENDING";
    orderName: string | null;
    errorMessage: string | null;
    receivedAt: string;
    repliedAt: string | null;
};

type LogsResponse = {
    logs: LogRow[];
    page: number;
    pageSize: number;
    total: number;
    hasMore: boolean;
};

const STATUS_TONE: Record<LogRow["status"], BadgeProps["tone"]> = {
    REPLIED: "success",
    FAILED: "critical",
    IGNORED: undefined,
    PENDING: "attention",
};

const formatDate = (iso: string) => new Date(iso).toLocaleString();

const StatCard: React.FC<{ label: string; value: number }> = ({
    label,
    value,
}) => (
    <Card>
        <BlockStack gap="100">
            <Text as="p" variant="bodySm" tone="subdued">
                {label}
            </Text>
            <Text as="p" variant="heading2xl">
                {value.toLocaleString()}
            </Text>
        </BlockStack>
    </Card>
);

const DashboardView: React.FC = () => {
    const authedFetch = useAuthedFetch();
    const [stats, setStats] = useState<Stats | null>(null);
    const [subscription, setSubscription] =
        useState<SubscriptionState | null>(null);
    const [logs, setLogs] = useState<LogsResponse | null>(null);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(
        async (p: number) => {
            setLoading(true);
            setError(null);
            try {
                const [statsRes, logsRes] = await Promise.all([
                    authedFetch("/api/internal/stats"),
                    authedFetch(`/api/internal/logs?page=${p}`),
                ]);
                if (!statsRes.ok) throw new Error(`stats ${statsRes.status}`);
                if (!logsRes.ok) throw new Error(`logs ${logsRes.status}`);
                const statsData = (await statsRes.json()) as {
                    stats: Stats;
                    subscription: SubscriptionState;
                };
                const logsData = (await logsRes.json()) as LogsResponse;
                setStats(statsData.stats);
                setSubscription(statsData.subscription);
                setLogs(logsData);
            } catch (e) {
                setError((e as Error).message);
            } finally {
                setLoading(false);
            }
        },
        [authedFetch]
    );

    useEffect(() => {
        void load(page);
    }, [load, page]);

    return (
        <BlockStack gap="400">
            {error && (
                <Banner tone="critical" title="Failed to load">
                    <p>{error}</p>
                </Banner>
            )}

            {subscription && (
                <BillingBanner status={subscription.status} />
            )}

            <InlineGrid columns={{ xs: 2, md: 4 }} gap="400">
                <StatCard label="Total emails processed" value={stats?.total ?? 0} />
                <StatCard label="WISMO detected" value={stats?.wismo ?? 0} />
                <StatCard label="Auto-replies sent" value={stats?.replied ?? 0} />
                <StatCard label="Failed lookups" value={stats?.failed ?? 0} />
            </InlineGrid>

            <Card padding="0">
                <BlockStack>
                    <div style={{ padding: 16 }}>
                        <Text as="h2" variant="headingMd">
                            Email log
                        </Text>
                    </div>

                    {loading && !logs ?
                        <InlineStack align="center" blockAlign="center">
                            <div style={{ padding: 32 }}>
                                <Spinner accessibilityLabel="Loading" size="large" />
                            </div>
                        </InlineStack>
                    : logs && logs.logs.length === 0 ?
                        <EmptyState
                            heading="No emails yet"
                            image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
                        >
                            <p>
                                Once your support inbox forwards a message,
                                you&apos;ll see it here.
                            </p>
                        </EmptyState>
                    :   <table
                            style={{
                                width: "100%",
                                borderCollapse: "collapse",
                                fontSize: 14,
                            }}
                        >
                            <thead>
                                <tr style={{ textAlign: "left" }}>
                                    <th style={th}>Customer</th>
                                    <th style={th}>Intent</th>
                                    <th style={th}>Order</th>
                                    <th style={th}>Status</th>
                                    <th style={th}>Received</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs?.logs.map((row) => (
                                    <tr key={row.id} style={tr}>
                                        <td style={td}>
                                            <BlockStack gap="050">
                                                <Text as="span" variant="bodyMd">
                                                    {row.senderEmail || "—"}
                                                </Text>
                                                <Text
                                                    as="span"
                                                    variant="bodySm"
                                                    tone="subdued"
                                                >
                                                    {row.subject || "(no subject)"}
                                                </Text>
                                            </BlockStack>
                                        </td>
                                        <td style={td}>
                                            <Badge
                                                tone={
                                                    row.intent === "WISMO" ?
                                                        "info"
                                                    :   undefined
                                                }
                                            >
                                                {row.intent}
                                            </Badge>
                                        </td>
                                        <td style={td}>{row.orderName ?? "—"}</td>
                                        <td style={td}>
                                            <BlockStack gap="050">
                                                <Badge tone={STATUS_TONE[row.status]}>
                                                    {row.status}
                                                </Badge>
                                                {row.errorMessage && (
                                                    <Text
                                                        as="span"
                                                        variant="bodySm"
                                                        tone="subdued"
                                                    >
                                                        {row.errorMessage}
                                                    </Text>
                                                )}
                                            </BlockStack>
                                        </td>
                                        <td style={td}>
                                            {formatDate(row.receivedAt)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    }

                    {logs && logs.total > logs.pageSize && (
                        <div
                            style={{
                                padding: 12,
                                borderTop: "1px solid var(--p-color-border)",
                            }}
                        >
                            <InlineStack align="center">
                                <Pagination
                                    hasPrevious={page > 0}
                                    onPrevious={() => setPage((p) => Math.max(0, p - 1))}
                                    hasNext={logs.hasMore}
                                    onNext={() => setPage((p) => p + 1)}
                                    label={`Page ${page + 1}`}
                                />
                            </InlineStack>
                        </div>
                    )}
                </BlockStack>
            </Card>
        </BlockStack>
    );
};

const th: React.CSSProperties = {
    padding: "10px 16px",
    borderBottom: "1px solid var(--p-color-border)",
    fontWeight: 500,
    color: "var(--p-color-text-secondary)",
};
const td: React.CSSProperties = {
    padding: "12px 16px",
    borderBottom: "1px solid var(--p-color-border-subdued)",
    verticalAlign: "top",
};
const tr: React.CSSProperties = {};

export default DashboardView;
