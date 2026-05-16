"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Badge,
    Banner,
    BlockStack,
    Box,
    Button,
    Card,
    EmptyState,
    InlineGrid,
    InlineStack,
    Pagination,
    Spinner,
    Tabs,
    Text,
    type BadgeProps,
} from "@shopify/polaris";
import { useAuthedFetch } from "../_lib/use-authed-fetch";
import BillingBanner from "./billing-banner";
import UsageCard from "./usage-card";
import PlanCard from "./plan-card";
import OnboardingCard from "./onboarding-card";
import LogsFilters, { EMPTY_FILTERS, type LogFilters } from "./logs-filters";
import LogDetailModal from "./log-detail-modal";
import TestEmailModal from "./test-email-modal";

type Stats = {
    total: number;
    wismo: number;
    replied: number;
    failed: number;
};

type SubscriptionState = {
    status: string | null;
    trialEndsOn: string | null;
    currentPeriodEnd: string | null;
};

type Usage = {
    used: number;
    quota: number;
    remaining: number;
    periodEnd: string | null;
    overQuota: boolean;
    nearLimit: boolean;
};

type Plan = {
    key: string | null;
    quota: number;
    retentionDays: number;
    languages: string[];
    multipleTemplates: boolean;
    toneControl: boolean;
    manualReviewMode: boolean;
    oneClickRetry: boolean;
};

type LogStatus =
    | "REPLIED"
    | "FAILED"
    | "IGNORED"
    | "PENDING"
    | "REVIEW"
    | "LIMIT_EXCEEDED"
    | "MISCLASSIFIED";

type LogRow = {
    id: string;
    senderEmail: string;
    subject: string;
    intent: "WISMO" | "OTHER";
    status: LogStatus;
    orderName: string | null;
    errorMessage: string | null;
    receivedAt: string;
    repliedAt: string | null;
    detectedLanguage: string | null;
    confidence: number | null;
    retryCount: number;
};

type LogsResponse = {
    logs: LogRow[];
    page: number;
    pageSize: number;
    total: number;
    hasMore: boolean;
};

const STATUS_TONE: Record<LogStatus, BadgeProps["tone"]> = {
    REPLIED: "success",
    FAILED: "critical",
    IGNORED: undefined,
    PENDING: "attention",
    REVIEW: "attention",
    LIMIT_EXCEEDED: "critical",
    MISCLASSIFIED: "warning",
};

const STATUS_LABEL: Record<LogStatus, string> = {
    REPLIED: "Replied",
    FAILED: "Failed",
    IGNORED: "Ignored",
    PENDING: "Pending",
    REVIEW: "Needs review",
    LIMIT_EXCEEDED: "Over quota",
    MISCLASSIFIED: "Misclassified",
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

type SettingsHints = {
    smtpConfigured: boolean;
    smtpVerifiedRecently: boolean;
};

const DashboardView: React.FC = () => {
    const authedFetch = useAuthedFetch();
    const [stats, setStats] = useState<Stats | null>(null);
    const [subscription, setSubscription] = useState<SubscriptionState | null>(
        null
    );
    const [usage, setUsage] = useState<Usage | null>(null);
    const [plan, setPlan] = useState<Plan | null>(null);
    const [settingsHints, setSettingsHints] = useState<SettingsHints | null>(
        null
    );
    const [logs, setLogs] = useState<LogsResponse | null>(null);
    const [page, setPage] = useState(0);
    const [tabIndex, setTabIndex] = useState(0);
    const [filters, setFilters] = useState<LogFilters>(EMPTY_FILTERS);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [openLog, setOpenLog] = useState<string | null>(null);
    const [testEmailOpen, setTestEmailOpen] = useState(false);

    // Tabs are filter shortcuts. Custom filters apply on top of the tab status.
    const tabs = useMemo(
        () => [
            { id: "all", content: "All", filter: "" },
            { id: "review", content: "Needs review", filter: "REVIEW" },
            { id: "failed", content: "Failed", filter: "FAILED" },
            { id: "replied", content: "Replied", filter: "REPLIED" },
        ],
        []
    );

    const effectiveStatus = filters.status || tabs[tabIndex].filter;

    // Debounce the free-text search so typing doesn't fire a query per
    // keystroke. The select/date filters are discrete so they apply at once.
    const [debouncedQ, setDebouncedQ] = useState("");
    useEffect(() => {
        const t = setTimeout(() => setDebouncedQ(filters.q), 350);
        return () => clearTimeout(t);
    }, [filters.q]);

    // Stats / usage / plan / settings don't change with the log filters, so
    // they load once (and after a row action) — not on every filter change.
    const loadMeta = useCallback(async () => {
        try {
            const [statsRes, usageRes, settingsRes] = await Promise.all([
                authedFetch("/api/internal/stats"),
                authedFetch("/api/internal/usage"),
                authedFetch("/api/internal/settings"),
            ]);
            if (!statsRes.ok) throw new Error(`stats ${statsRes.status}`);
            if (!usageRes.ok) throw new Error(`usage ${usageRes.status}`);
            const statsData = (await statsRes.json()) as {
                stats: Stats;
                subscription: SubscriptionState;
            };
            const usageData = (await usageRes.json()) as {
                usage: Usage;
                plan: Plan;
            };
            setStats(statsData.stats);
            setSubscription(statsData.subscription);
            setUsage(usageData.usage);
            setPlan(usageData.plan);

            if (settingsRes.ok) {
                const sd = (await settingsRes.json()) as {
                    settings: {
                        smtpHost: string | null;
                        smtpPort: number | null;
                        smtpUser: string | null;
                        smtpFromAddress: string | null;
                        hasSmtpPass: boolean;
                        smtpLastVerifiedAt: string | null;
                    } | null;
                };
                const s = sd.settings;
                setSettingsHints({
                    smtpConfigured: Boolean(
                        s?.smtpHost &&
                        s.smtpPort &&
                        s.smtpUser &&
                        s.smtpFromAddress &&
                        s.hasSmtpPass
                    ),
                    smtpVerifiedRecently: Boolean(s?.smtpLastVerifiedAt),
                });
            }
        } catch (e) {
            setError((e as Error).message);
        }
    }, [authedFetch]);

    // Only the log list reacts to filters/tab/page.
    const loadLogs = useCallback(
        async (p: number) => {
            setLoading(true);
            setError(null);
            try {
                const params = new URLSearchParams();
                params.set("page", String(p));
                if (effectiveStatus) params.set("status", effectiveStatus);
                if (filters.intent) params.set("intent", filters.intent);
                if (debouncedQ) params.set("q", debouncedQ);
                if (filters.from) params.set("from", filters.from);
                if (filters.to) params.set("to", filters.to);

                const res = await authedFetch(
                    `/api/internal/logs?${params.toString()}`
                );
                if (!res.ok) throw new Error(`logs ${res.status}`);
                setLogs((await res.json()) as LogsResponse);
            } catch (e) {
                setError((e as Error).message);
            } finally {
                setLoading(false);
            }
        },
        [
            authedFetch,
            effectiveStatus,
            filters.intent,
            debouncedQ,
            filters.from,
            filters.to,
        ]
    );

    useEffect(() => {
        void loadMeta();
    }, [loadMeta]);

    useEffect(() => {
        void loadLogs(page);
    }, [loadLogs, page]);

    // Reset to page 0 when filter/tab inputs change.
    useEffect(() => {
        setPage(0);
    }, [effectiveStatus, filters.intent, debouncedQ, filters.from, filters.to]);

    const refreshAfterRowAction = useCallback(() => {
        void loadLogs(page);
        void loadMeta();
    }, [loadLogs, loadMeta, page]);

    const exportCsv = () => {
        // Window navigation here triggers the streaming CSV download; the
        // session token can't ride a normal <a> click, so we fetch via the
        // authed helper and blob-it. Small enough to keep in memory.
        (async () => {
            const res = await authedFetch("/api/internal/logs/export");
            if (!res.ok) return;
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `valyn-logs-${new Date().toISOString().slice(0, 10)}.csv`;
            a.click();
            URL.revokeObjectURL(url);
        })();
    };

    const subscriptionActive = subscription?.status === "ACTIVE";

    const onboardingSteps = useMemo(
        () => [
            { label: "Choose a plan", done: subscriptionActive },
            {
                label: "Set up outgoing email",
                done: Boolean(
                    settingsHints?.smtpConfigured &&
                    settingsHints?.smtpVerifiedRecently
                ),
                action: { label: "Set up email →", href: "/settings" },
            },
            {
                label: "Forward your support inbox",
                done: (stats?.total ?? 0) > 0,
                action: {
                    label: "Get forwarding address →",
                    href: "/settings#forwarding",
                },
            },
            {
                label: "Receive your first processed email",
                done: (stats?.total ?? 0) > 0,
                action: {
                    label: "Send a test email →",
                    onClick: () => setTestEmailOpen(true),
                },
            },
        ],
        [subscriptionActive, settingsHints, stats]
    );
    const onboardingAllDone = onboardingSteps.every((s) => s.done);

    return (
        <BlockStack gap="400">
            {error && (
                <Banner tone="critical" title="Failed to load">
                    <p>{error}</p>
                </Banner>
            )}

            {subscription && (
                <BillingBanner
                    status={
                        subscription.status as
                            | "PENDING"
                            | "ACTIVE"
                            | "CANCELLED"
                            | "DECLINED"
                            | "EXPIRED"
                            | "FROZEN"
                            | null
                    }
                />
            )}

            {!onboardingAllDone && (
                <OnboardingCard
                    steps={onboardingSteps}
                    allDone={onboardingAllDone}
                />
            )}

            <InlineGrid columns={{ xs: 1, md: 3 }} gap="400">
                {usage && (
                    <UsageCard
                        used={usage.used}
                        quota={usage.quota}
                        remaining={usage.remaining}
                        periodEnd={usage.periodEnd}
                        overQuota={usage.overQuota}
                        nearLimit={usage.nearLimit}
                    />
                )}
                {subscription && (
                    <PlanCard
                        planKey={plan?.key ?? null}
                        status={subscription.status}
                        trialEndsOn={subscription.trialEndsOn}
                        currentPeriodEnd={subscription.currentPeriodEnd}
                    />
                )}
                <Card>
                    <BlockStack gap="100">
                        <Text as="h3" variant="headingSm">
                            Failed lookups
                        </Text>
                        <Text as="p" variant="heading2xl">
                            {(stats?.failed ?? 0).toLocaleString()}
                        </Text>
                        <Text as="p" variant="bodySm" tone="subdued">
                            Awaiting review or retry
                        </Text>
                    </BlockStack>
                </Card>
            </InlineGrid>

            <InlineGrid columns={{ xs: 2, md: 4 }} gap="400">
                <StatCard label="Total processed" value={stats?.total ?? 0} />
                <StatCard label="WISMO detected" value={stats?.wismo ?? 0} />
                <StatCard
                    label="Auto-replies sent"
                    value={stats?.replied ?? 0}
                />
                <StatCard label="Retention" value={plan?.retentionDays ?? 0} />
            </InlineGrid>

            <Card padding="0">
                <BlockStack>
                    <Box padding="400">
                        <InlineStack
                            align="space-between"
                            blockAlign="center"
                            wrap
                        >
                            <Text as="h2" variant="headingMd">
                                Email log
                            </Text>
                            <Button onClick={exportCsv} variant="secondary">
                                Export CSV
                            </Button>
                        </InlineStack>
                    </Box>

                    <Tabs
                        tabs={tabs}
                        selected={tabIndex}
                        onSelect={(i) => setTabIndex(i)}
                    >
                        <Box padding="400" paddingBlockStart="200">
                            <LogsFilters
                                value={filters}
                                onChange={setFilters}
                                onReset={() => setFilters(EMPTY_FILTERS)}
                            />
                        </Box>
                    </Tabs>

                    {loading && !logs ?
                        <InlineStack align="center" blockAlign="center">
                            <Box padding="800">
                                <Spinner
                                    accessibilityLabel="Loading"
                                    size="large"
                                />
                            </Box>
                        </InlineStack>
                    : logs && logs.logs.length === 0 ?
                        <EmptyState
                            heading="No matching emails"
                            image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
                        >
                            <p>
                                Try clearing filters, or wait for your support
                                inbox to forward a message.
                            </p>
                        </EmptyState>
                    :   <table
                            style={{
                                width: "100%",
                                borderCollapse: "collapse",
                                fontSize: 14,
                                opacity: loading ? 0.5 : 1,
                                transition: "opacity 120ms ease",
                                pointerEvents: loading ? "none" : "auto",
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
                                    <tr
                                        key={row.id}
                                        style={trStyle}
                                        onClick={() => setOpenLog(row.id)}
                                    >
                                        <td style={td}>
                                            <BlockStack gap="050">
                                                <Text
                                                    as="span"
                                                    variant="bodyMd"
                                                >
                                                    {row.senderEmail || "—"}
                                                </Text>
                                                <Text
                                                    as="span"
                                                    variant="bodySm"
                                                    tone="subdued"
                                                >
                                                    {row.subject ||
                                                        "(no subject)"}
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
                                        <td style={td}>
                                            {row.orderName ?? "—"}
                                        </td>
                                        <td style={td}>
                                            <BlockStack gap="050">
                                                <Badge
                                                    tone={
                                                        STATUS_TONE[row.status]
                                                    }
                                                >
                                                    {STATUS_LABEL[row.status]}
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
                        <Box
                            padding="300"
                            borderBlockStartWidth="025"
                            borderColor="border"
                        >
                            <InlineStack align="center">
                                <Pagination
                                    hasPrevious={page > 0}
                                    onPrevious={() =>
                                        setPage((p) => Math.max(0, p - 1))
                                    }
                                    hasNext={logs.hasMore}
                                    onNext={() => setPage((p) => p + 1)}
                                    label={`Page ${page + 1}`}
                                />
                            </InlineStack>
                        </Box>
                    )}
                </BlockStack>
            </Card>

            <LogDetailModal
                open={openLog !== null}
                logId={openLog}
                caps={{
                    oneClickRetry: plan?.oneClickRetry ?? false,
                    manualReviewMode: plan?.manualReviewMode ?? false,
                }}
                onClose={() => setOpenLog(null)}
                onChanged={refreshAfterRowAction}
            />
            <TestEmailModal
                open={testEmailOpen}
                onClose={() => setTestEmailOpen(false)}
            />
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
const trStyle: React.CSSProperties = { cursor: "pointer" };

export default DashboardView;
