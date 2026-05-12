"use client";

import { BlockStack, Card, InlineStack, ProgressBar, Text } from "@shopify/polaris";

type UsageProps = {
    used: number;
    quota: number;
    remaining: number;
    periodEnd: string | null;
    overQuota: boolean;
    nearLimit: boolean;
};

const UsageCard: React.FC<UsageProps> = ({
    used,
    quota,
    remaining,
    periodEnd,
    overQuota,
    nearLimit,
}) => {
    const pct = Math.min(100, Math.round((used / quota) * 100));
    return (
        <Card>
            <BlockStack gap="200">
                <InlineStack align="space-between" blockAlign="center">
                    <Text as="h3" variant="headingSm">
                        Plan usage
                    </Text>
                    <Text
                        as="span"
                        variant="bodySm"
                        tone={
                            overQuota ? "critical"
                            : nearLimit ? "caution"
                            : "subdued"
                        }
                    >
                        {used.toLocaleString()} /{" "}
                        {quota.toLocaleString()} emails
                    </Text>
                </InlineStack>
                <ProgressBar
                    progress={pct}
                    tone={
                        overQuota ? "critical"
                        : nearLimit ? "highlight"
                        : "primary"
                    }
                />
                <InlineStack align="space-between">
                    <Text as="p" variant="bodySm" tone="subdued">
                        {overQuota ?
                            "Over quota — auto-replies are paused until next period."
                        : nearLimit ?
                            `${remaining.toLocaleString()} left this period`
                        :   `${remaining.toLocaleString()} remaining`}
                    </Text>
                    {periodEnd && (
                        <Text as="p" variant="bodySm" tone="subdued">
                            Resets {new Date(periodEnd).toLocaleDateString()}
                        </Text>
                    )}
                </InlineStack>
            </BlockStack>
        </Card>
    );
};

export default UsageCard;
