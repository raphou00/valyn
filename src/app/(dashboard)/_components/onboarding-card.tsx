"use client";

import {
    BlockStack,
    Button,
    Card,
    InlineStack,
    Text,
} from "@shopify/polaris";

export type OnboardingAction = {
    label: string;
    href?: string;
    onClick?: () => void;
};

export type OnboardingStep = {
    label: string;
    done: boolean;
    action?: OnboardingAction;
};

const Dot: React.FC<{ done: boolean }> = ({ done }) => (
    <span
        aria-hidden
        style={{
            width: 18,
            height: 18,
            borderRadius: "50%",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            background: done ? "var(--p-color-bg-success)" : "transparent",
            border: done ? "none" : "1.5px solid var(--p-color-border)",
            color: "#fff",
            fontSize: 12,
            lineHeight: 1,
            flexShrink: 0,
        }}
    >
        {done ? "✓" : ""}
    </span>
);

const OnboardingCard: React.FC<{
    steps: OnboardingStep[];
    allDone: boolean;
}> = ({ steps, allDone }) => {
    if (allDone) return null;
    const remaining = steps.filter((s) => !s.done).length;
    return (
        <Card>
            <BlockStack gap="200">
                <InlineStack align="space-between" blockAlign="center">
                    <Text as="h3" variant="headingSm">
                        Get set up
                    </Text>
                    <Text as="span" variant="bodySm" tone="subdued">
                        {steps.length - remaining} of {steps.length} done
                    </Text>
                </InlineStack>
                <BlockStack gap="150">
                    {steps.map((s) => (
                        <InlineStack
                            key={s.label}
                            gap="300"
                            align="space-between"
                            blockAlign="center"
                            wrap={false}
                        >
                            <InlineStack gap="200" blockAlign="center">
                                <Dot done={s.done} />
                                <Text
                                    as="span"
                                    variant="bodyMd"
                                    tone={s.done ? "subdued" : undefined}
                                    textDecorationLine={
                                        s.done ? "line-through" : undefined
                                    }
                                >
                                    {s.label}
                                </Text>
                            </InlineStack>
                            {!s.done && s.action && (
                                <Button
                                    variant="plain"
                                    url={s.action.href}
                                    onClick={s.action.onClick}
                                >
                                    {s.action.label}
                                </Button>
                            )}
                        </InlineStack>
                    ))}
                </BlockStack>
            </BlockStack>
        </Card>
    );
};

export default OnboardingCard;
