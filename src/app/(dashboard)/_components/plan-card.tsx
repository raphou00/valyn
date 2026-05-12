"use client";

import { Badge, BlockStack, Card, InlineStack, Text } from "@shopify/polaris";

type Props = {
    planKey: string | null;
    status: string | null;
    trialEndsOn: string | null;
    currentPeriodEnd: string | null;
};

const PRETTY: Record<string, { label: string; tone: "success" | "info" | "warning" | "critical" }> = {
    ACTIVE: { label: "Active", tone: "success" },
    PENDING: { label: "Pending approval", tone: "info" },
    CANCELLED: { label: "Cancelled", tone: "warning" },
    DECLINED: { label: "Declined", tone: "critical" },
    EXPIRED: { label: "Expired", tone: "critical" },
    FROZEN: { label: "Frozen", tone: "critical" },
};

const PlanCard: React.FC<Props> = ({
    planKey,
    status,
    trialEndsOn,
    currentPeriodEnd,
}) => {
    const planLabel =
        planKey === "starter" ? "Starter"
        : planKey === "pro" ? "Pro"
        : "—";
    const meta = status ? PRETTY[status] : null;
    const inTrial =
        trialEndsOn && new Date(trialEndsOn).getTime() > Date.now();
    return (
        <Card>
            <BlockStack gap="200">
                <InlineStack align="space-between" blockAlign="center">
                    <Text as="h3" variant="headingSm">
                        Subscription
                    </Text>
                    {meta && <Badge tone={meta.tone}>{meta.label}</Badge>}
                </InlineStack>
                <Text as="p" variant="headingMd">
                    {planLabel}
                </Text>
                {inTrial && trialEndsOn && (
                    <Text as="p" variant="bodySm" tone="subdued">
                        Trial ends {new Date(trialEndsOn).toLocaleDateString()}
                    </Text>
                )}
                {currentPeriodEnd && (
                    <Text as="p" variant="bodySm" tone="subdued">
                        Renews{" "}
                        {new Date(currentPeriodEnd).toLocaleDateString()}
                    </Text>
                )}
            </BlockStack>
        </Card>
    );
};

export default PlanCard;
