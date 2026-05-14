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
import { useAuthedFetch } from "../_lib/use-authed-fetch";
import ForwardingInstructions from "./forwarding-instructions";
import SmtpSection, { type SmtpSectionValues } from "./smtp-section";
import {
    SMTP_PROVIDERS,
    detectSmtpProvider,
    type SmtpProviderKey,
} from "@/lib/smtp-providers";

export type WizardSettings = SmtpSectionValues & {
    inboundAddress: string | null;
};

type Step = 1 | 2 | 3;

type Props = {
    settings: WizardSettings;
    onDone: () => void;
};

const ProviderChoice: React.FC<{
    title: string;
    body: string;
    onClick: () => void;
}> = ({ title, body, onClick }) => (
    <Card>
        <BlockStack gap="200">
            <Text as="h3" variant="headingMd">
                {title}
            </Text>
            <Text as="p" tone="subdued" variant="bodySm">
                {body}
            </Text>
            <InlineStack align="end">
                <Button onClick={onClick} variant="primary">
                    Choose
                </Button>
            </InlineStack>
        </BlockStack>
    </Card>
);

const OnboardingWizard: React.FC<Props> = ({ settings, onDone }) => {
    const authedFetch = useAuthedFetch();
    const [step, setStep] = useState<Step>(1);
    const [provider, setProvider] = useState<SmtpProviderKey>(
        detectSmtpProvider(settings.smtpHost)
    );
    const [s, setS] = useState<WizardSettings>(settings);
    const [smtpPass, setSmtpPass] = useState("");
    const [showHelp, setShowHelp] = useState(true);
    const [testing, setTesting] = useState(false);
    const [test, setTest] = useState<{
        ok: boolean;
        message?: string;
        sentTo?: string;
    } | null>(null);

    const applyProvider = (next: SmtpProviderKey) => {
        setProvider(next);
        if (next !== "other") {
            const p = SMTP_PROVIDERS[next];
            setS((prev) => ({
                ...prev,
                smtpHost: p.host,
                smtpPort: p.port,
                smtpSecure: p.secure,
                smtpUser: prev.smtpFromAddress ?? prev.smtpUser,
            }));
        }
        setStep(2);
    };

    const updateField = <K extends keyof SmtpSectionValues>(
        key: K,
        value: SmtpSectionValues[K]
    ) => {
        setS((prev) => ({ ...prev, [key]: value }));
    };

    const onTestAndSave = async () => {
        setTesting(true);
        setTest(null);
        try {
            const body: Record<string, unknown> = {
                smtpHost: s.smtpHost || null,
                smtpPort: s.smtpPort,
                smtpSecure: s.smtpSecure,
                smtpUser: s.smtpUser || null,
                smtpFromName: s.smtpFromName || null,
                smtpFromAddress: s.smtpFromAddress || null,
            };
            if (smtpPass) body.smtpPass = smtpPass;
            const saveRes = await authedFetch("/api/internal/settings", {
                method: "PATCH",
                body: JSON.stringify(body),
            });
            if (!saveRes.ok) {
                const data = (await saveRes.json()) as { message?: string };
                throw new Error(data.message ?? `save ${saveRes.status}`);
            }
            setSmtpPass("");
            const res = await authedFetch("/api/internal/smtp/test", {
                method: "POST",
            });
            const data = (await res.json()) as {
                ok: boolean;
                message?: string;
                sentTo?: string;
            };
            setTest(data);
            if (data.ok) {
                const sr = await authedFetch("/api/internal/settings");
                if (sr.ok) {
                    const sd = (await sr.json()) as {
                        settings: WizardSettings;
                    };
                    setS(sd.settings);
                }
                setStep(3);
            }
        } catch (e) {
            setTest({ ok: false, message: (e as Error).message });
        } finally {
            setTesting(false);
        }
    };

    return (
        <BlockStack gap="400">
            <Card>
                <BlockStack gap="100">
                    <Text as="h2" variant="headingLg">
                        Welcome to Valyn
                    </Text>
                    <Text as="p" tone="subdued">
                        Two steps and you&apos;re live: outgoing email, then
                        forwarding.
                    </Text>
                </BlockStack>
            </Card>
            <BlockStack gap="400">
                <Card>
                    <InlineStack gap="200" align="center">
                        {([1, 2, 3] as Step[]).map((n) => (
                            <Text
                                key={n}
                                as="span"
                                variant="bodySm"
                                tone={n === step ? undefined : "subdued"}
                            >
                                {n === step ?
                                    <strong>Step {n}</strong>
                                :   `Step ${n}`}
                                {n < 3 && "  ·  "}
                            </Text>
                        ))}
                    </InlineStack>
                </Card>

                {step === 1 && (
                    <Card>
                        <BlockStack gap="400">
                            <Text as="h2" variant="headingLg">
                                How do you send support emails?
                            </Text>
                            <Text as="p" tone="subdued">
                                Valyn replies through your own provider, so
                                customers see your store&apos;s address.
                            </Text>
                            <InlineGrid columns={{ xs: 1, sm: 3 }} gap="300">
                                <ProviderChoice
                                    title="Gmail"
                                    body="Personal or Google Workspace."
                                    onClick={() => applyProvider("gmail")}
                                />
                                <ProviderChoice
                                    title="Outlook / Microsoft 365"
                                    body="outlook.com, hotmail.com, or M365."
                                    onClick={() => applyProvider("outlook")}
                                />
                                <ProviderChoice
                                    title="Something else"
                                    body="Custom SMTP — enter host, port, and TLS."
                                    onClick={() => applyProvider("other")}
                                />
                            </InlineGrid>
                        </BlockStack>
                    </Card>
                )}

                {step === 2 && (
                    <BlockStack gap="300">
                        <Card>
                            <InlineStack
                                align="space-between"
                                blockAlign="center"
                            >
                                <Text as="h2" variant="headingMd">
                                    Enter your email credentials
                                </Text>
                                <Button
                                    variant="plain"
                                    onClick={() => setStep(1)}
                                >
                                    Change provider
                                </Button>
                            </InlineStack>
                        </Card>
                        <SmtpSection
                            values={s}
                            smtpPass={smtpPass}
                            setSmtpPass={setSmtpPass}
                            provider={provider}
                            onProviderChange={applyProvider}
                            showHelp={showHelp}
                            onToggleHelp={() => setShowHelp((v) => !v)}
                            updateField={updateField}
                            onTestAndSave={onTestAndSave}
                            testing={testing}
                            test={test}
                            dismissTest={() => setTest(null)}
                            primaryLabel="Save and test"
                        />
                    </BlockStack>
                )}

                {step === 3 && (
                    <BlockStack gap="300">
                        <Banner
                            tone="success"
                            title="Outgoing email is working"
                        >
                            <p>
                                One more step — forward your support inbox to
                                the address below.
                            </p>
                        </Banner>
                        <ForwardingInstructions
                            inboundAddress={s.inboundAddress}
                        />
                        <Box paddingBlockStart="200">
                            <InlineStack align="end">
                                <Button variant="primary" onClick={onDone}>
                                    Done — take me to the dashboard
                                </Button>
                            </InlineStack>
                        </Box>
                    </BlockStack>
                )}

                <InlineStack align="start">
                    <Button variant="plain" onClick={onDone}>
                        Skip for now — I&apos;ll set up later
                    </Button>
                </InlineStack>
            </BlockStack>
        </BlockStack>
    );
};

export default OnboardingWizard;
