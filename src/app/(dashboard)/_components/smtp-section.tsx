"use client";

import { useMemo } from "react";
import {
    Badge,
    Banner,
    BlockStack,
    Box,
    Button,
    Card,
    Checkbox,
    Collapsible,
    FormLayout,
    InlineStack,
    Link,
    List,
    Tabs,
    Text,
    TextField,
} from "@shopify/polaris";
import {
    SMTP_PROVIDERS,
    type SmtpProviderKey,
} from "@/lib/smtp-providers";

export type SmtpSectionValues = {
    smtpHost: string | null;
    smtpPort: number | null;
    smtpSecure: boolean;
    smtpUser: string | null;
    smtpFromName: string | null;
    smtpFromAddress: string | null;
    hasSmtpPass: boolean;
    smtpLastVerifiedAt: string | null;
    smtpLastError: string | null;
};

type TestState = { ok: boolean; message?: string } | null;

type Props = {
    values: SmtpSectionValues;
    smtpPass: string;
    setSmtpPass: (v: string) => void;
    provider: SmtpProviderKey;
    onProviderChange: (p: SmtpProviderKey) => void;
    showHelp: boolean;
    onToggleHelp: () => void;
    updateField: <K extends keyof SmtpSectionValues>(
        key: K,
        value: SmtpSectionValues[K]
    ) => void;
    onTestAndSave: () => void;
    testing: boolean;
    test: TestState;
    dismissTest: () => void;
    primaryLabel?: string;
};

const PROVIDER_TABS = [
    { id: "gmail", content: "Gmail" },
    { id: "outlook", content: "Outlook" },
    { id: "other", content: "Other" },
] as const;

const SmtpSection: React.FC<Props> = ({
    values,
    smtpPass,
    setSmtpPass,
    provider,
    onProviderChange,
    showHelp,
    onToggleHelp,
    updateField,
    onTestAndSave,
    testing,
    test,
    dismissTest,
    primaryLabel = "Test & save",
}) => {
    const tabIndex = useMemo(
        () => PROVIDER_TABS.findIndex((t) => t.id === provider),
        [provider]
    );

    const onTabSelect = (i: number) => {
        const next = PROVIDER_TABS[i].id as SmtpProviderKey;
        onProviderChange(next);
    };

    // Gmail/Outlook hide the technical fields. We still keep them in sync in
    // state via onProviderChange (handled by the parent) so the saved row has
    // real values.
    const simple = provider !== "other";
    const email = values.smtpFromAddress ?? "";

    const onEmailChange = (v: string) => {
        updateField("smtpFromAddress", v);
        if (simple) updateField("smtpUser", v);
    };

    return (
        <Card>
            <BlockStack gap="300">
                <InlineStack align="space-between" blockAlign="center">
                    <Text as="h3" variant="headingSm">
                        Outgoing email
                    </Text>
                    {values.smtpLastVerifiedAt && !values.smtpLastError ?
                        <Badge tone="success">
                            {`Verified ${new Date(values.smtpLastVerifiedAt).toLocaleDateString()}`}
                        </Badge>
                    : values.smtpLastError ?
                        <Badge tone="critical">Last test failed</Badge>
                    :   <Badge>Not tested</Badge>}
                </InlineStack>
                {values.smtpLastError && (
                    <Text as="p" tone="critical" variant="bodySm">
                        {values.smtpLastError}
                    </Text>
                )}

                <Tabs
                    tabs={PROVIDER_TABS.map((t) => ({
                        id: t.id,
                        content: t.content,
                    }))}
                    selected={tabIndex < 0 ? 2 : tabIndex}
                    onSelect={onTabSelect}
                >
                    <Box paddingBlockStart="300">
                        {simple ?
                            <FormLayout>
                                <TextField
                                    label="Your support email address"
                                    type="email"
                                    value={email}
                                    onChange={onEmailChange}
                                    autoComplete="email"
                                    placeholder="support@yourstore.com"
                                />
                                <TextField
                                    label={
                                        values.hasSmtpPass ?
                                            "App password (saved — leave blank to keep)"
                                        :   "App password"
                                    }
                                    type="password"
                                    value={smtpPass}
                                    onChange={setSmtpPass}
                                    autoComplete="new-password"
                                    helpText={
                                        <Link
                                            onClick={onToggleHelp}
                                            removeUnderline
                                        >
                                            {showHelp ?
                                                "Hide instructions"
                                            :   "What is an app password?"}
                                        </Link>
                                    }
                                />
                                <Collapsible
                                    id="app-password-help"
                                    open={showHelp}
                                    transition={{
                                        duration: "150ms",
                                        timingFunction: "ease",
                                    }}
                                >
                                    <Box paddingBlockEnd="200">
                                        <BlockStack gap="200">
                                            <Text as="p" tone="subdued">
                                                Gmail and Outlook don&apos;t
                                                let apps use your regular
                                                password. You need to create a
                                                one-time app password — about
                                                30 seconds.
                                            </Text>
                                            {provider === "gmail" ?
                                                <List type="number">
                                                    <List.Item>
                                                        Go to{" "}
                                                        <Link
                                                            url="https://myaccount.google.com/apppasswords"
                                                            target="_blank"
                                                        >
                                                            myaccount.google.com
                                                            → Security → App
                                                            passwords
                                                        </Link>{" "}
                                                        (requires 2-Step
                                                        Verification).
                                                    </List.Item>
                                                    <List.Item>
                                                        Select{" "}
                                                        <strong>Mail</strong>{" "}
                                                        and your device, click{" "}
                                                        <strong>
                                                            Generate
                                                        </strong>
                                                        .
                                                    </List.Item>
                                                    <List.Item>
                                                        Copy the 16-character
                                                        password and paste it
                                                        above.
                                                    </List.Item>
                                                </List>
                                            :   <List type="number">
                                                    <List.Item>
                                                        Go to{" "}
                                                        <Link
                                                            url="https://account.microsoft.com/security"
                                                            target="_blank"
                                                        >
                                                            account.microsoft.com
                                                            → Security →
                                                            Advanced security
                                                            options → App
                                                            passwords
                                                        </Link>
                                                        .
                                                    </List.Item>
                                                    <List.Item>
                                                        Click{" "}
                                                        <strong>
                                                            Create a new app
                                                            password
                                                        </strong>
                                                        .
                                                    </List.Item>
                                                    <List.Item>
                                                        Copy and paste it
                                                        above.
                                                    </List.Item>
                                                </List>
                                            }
                                        </BlockStack>
                                    </Box>
                                </Collapsible>
                                <TextField
                                    label="From name (shown to customers)"
                                    value={values.smtpFromName ?? ""}
                                    onChange={(v) =>
                                        updateField("smtpFromName", v)
                                    }
                                    autoComplete="off"
                                    placeholder="Your Store"
                                />
                            </FormLayout>
                        :   <FormLayout>
                                <FormLayout.Group>
                                    <TextField
                                        label="SMTP host"
                                        value={values.smtpHost ?? ""}
                                        onChange={(v) =>
                                            updateField("smtpHost", v)
                                        }
                                        autoComplete="off"
                                    />
                                    <TextField
                                        label="Port"
                                        type="number"
                                        value={values.smtpPort?.toString() ?? ""}
                                        onChange={(v) =>
                                            updateField(
                                                "smtpPort",
                                                v ? parseInt(v, 10) : null
                                            )
                                        }
                                        autoComplete="off"
                                    />
                                </FormLayout.Group>
                                <Checkbox
                                    label="Use TLS (recommended)"
                                    checked={values.smtpSecure}
                                    onChange={(v) =>
                                        updateField("smtpSecure", v)
                                    }
                                />
                                <TextField
                                    label="Username"
                                    value={values.smtpUser ?? ""}
                                    onChange={(v) => updateField("smtpUser", v)}
                                    autoComplete="off"
                                />
                                <TextField
                                    label={
                                        values.hasSmtpPass ?
                                            "Password (saved — leave blank to keep)"
                                        :   "Password"
                                    }
                                    type="password"
                                    value={smtpPass}
                                    onChange={setSmtpPass}
                                    autoComplete="new-password"
                                />
                                <FormLayout.Group>
                                    <TextField
                                        label="From name"
                                        value={values.smtpFromName ?? ""}
                                        onChange={(v) =>
                                            updateField("smtpFromName", v)
                                        }
                                        autoComplete="off"
                                    />
                                    <TextField
                                        label="From address"
                                        type="email"
                                        value={values.smtpFromAddress ?? ""}
                                        onChange={(v) =>
                                            updateField("smtpFromAddress", v)
                                        }
                                        autoComplete="email"
                                    />
                                </FormLayout.Group>
                            </FormLayout>
                        }
                    </Box>
                </Tabs>

                <InlineStack align="end" gap="200">
                    <Button
                        variant="primary"
                        loading={testing}
                        onClick={onTestAndSave}
                    >
                        {primaryLabel}
                    </Button>
                </InlineStack>

                {test && (
                    <Banner
                        tone={test.ok ? "success" : "critical"}
                        title={
                            test.ok ?
                                "Outgoing email is working"
                            :   "We couldn't send through this account"
                        }
                        onDismiss={dismissTest}
                    >
                        {test.message && <p>{test.message}</p>}
                    </Banner>
                )}
            </BlockStack>
        </Card>
    );
};

export default SmtpSection;
export { SMTP_PROVIDERS };
