"use client";

import { useState } from "react";
import {
    Banner,
    BlockStack,
    Box,
    Button,
    Card,
    InlineGrid,
    InlineStack,
    Text,
} from "@shopify/polaris";
import { PLANS, type PlanKey } from "@/config/billing";
import { useAuthedFetch } from "../_lib/use-authed-fetch";

type Status =
    | "PENDING"
    | "ACTIVE"
    | "CANCELLED"
    | "DECLINED"
    | "EXPIRED"
    | "FROZEN"
    | null;

type Props = { status: Status };

const TITLES: Record<string, string> = {
    NULL: "Choose a plan to start sending replies",
    PENDING: "Subscription pending — confirm to activate",
    CANCELLED: "Subscription cancelled — pick a plan to resume",
    DECLINED: "Subscription declined — pick a plan to continue",
    EXPIRED: "Subscription expired — pick a plan to resume",
    FROZEN: "Subscription frozen — please update your billing",
};

const planList: PlanKey[] = ["starter", "pro"];

const BillingBanner: React.FC<Props> = ({ status }) => {
    const authedFetch = useAuthedFetch();
    const [loadingKey, setLoadingKey] = useState<PlanKey | null>(null);
    const [error, setError] = useState<string | null>(null);

    if (status === "ACTIVE") return null;

    const onSubscribe = async (plan: PlanKey) => {
        setLoadingKey(plan);
        setError(null);
        try {
            const res = await authedFetch("/api/internal/billing/start", {
                method: "POST",
                body: JSON.stringify({ plan }),
            });
            if (!res.ok) throw new Error(`start ${res.status}`);
            const { confirmationUrl } = (await res.json()) as {
                confirmationUrl: string;
            };
            // Top-frame redirect: the Shopify charge approval page must replace
            // the whole admin frame, not load inside our embedded iframe.
            if (window.top) {
                window.top.location.href = confirmationUrl;
            } else {
                window.location.href = confirmationUrl;
            }
        } catch (e) {
            setError((e as Error).message);
            setLoadingKey(null);
        }
    };

    return (
        <Banner
            tone={status === "PENDING" ? "info" : "warning"}
            title={TITLES[status ?? "NULL"] ?? TITLES.NULL}
        >
            <BlockStack gap="300">
                <Text as="p" variant="bodyMd">
                    Auto-replies are paused until your subscription is active.
                    Both plans include a 7-day free trial — no card required to
                    install.
                </Text>

                <InlineGrid columns={{ xs: 1, sm: 2 }} gap="300">
                    {planList.map((key) => {
                        const plan = PLANS[key];
                        return (
                            <Card key={key}>
                                <BlockStack gap="200">
                                    <InlineStack
                                        align="space-between"
                                        blockAlign="center"
                                    >
                                        <Text as="h3" variant="headingMd">
                                            {plan.name}
                                        </Text>
                                        <Text as="p" variant="headingLg">
                                            ${plan.amount}
                                            <Text
                                                as="span"
                                                variant="bodySm"
                                                tone="subdued"
                                            >
                                                /mo
                                            </Text>
                                        </Text>
                                    </InlineStack>
                                    <Text
                                        as="p"
                                        tone="subdued"
                                        variant="bodySm"
                                    >
                                        {plan.description}
                                    </Text>
                                    <Text as="p" variant="bodySm">
                                        Up to {plan.emailQuota.toLocaleString()}{" "}
                                        emails / month
                                    </Text>
                                    <Box paddingBlockStart="100">
                                        <Button
                                            variant={
                                                key === "pro" ? "primary" : (
                                                    "secondary"
                                                )
                                            }
                                            loading={loadingKey === key}
                                            disabled={
                                                loadingKey !== null &&
                                                loadingKey !== key
                                            }
                                            onClick={() => onSubscribe(key)}
                                            fullWidth
                                        >
                                            {status === "PENDING" ?
                                                "Resume approval"
                                            :   `Start ${plan.name}`}
                                        </Button>
                                    </Box>
                                </BlockStack>
                            </Card>
                        );
                    })}
                </InlineGrid>

                {error && (
                    <Text as="p" tone="critical" variant="bodySm">
                        {error}
                    </Text>
                )}
            </BlockStack>
        </Banner>
    );
};

export default BillingBanner;
