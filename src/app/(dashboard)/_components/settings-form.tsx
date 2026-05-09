"use client";

import { useEffect, useState } from "react";
import {
    Banner,
    BlockStack,
    Button,
    Card,
    Checkbox,
    FormLayout,
    InlineStack,
    Layout,
    Select,
    Spinner,
    TextField,
} from "@shopify/polaris";
import { useAuthedFetch } from "../_lib/use-authed-fetch";
import ForwardingInstructions from "./forwarding-instructions";

type SettingsDTO = {
    autoReplyEnabled: boolean;
    responseDelaySeconds: number;
    language: "en" | "fr" | "de";
    tone: "NEUTRAL" | "FRIENDLY" | "FORMAL";
    greeting: string;
    signature: string;
    supportEmail: string | null;
    inboundAddress: string | null;
    smtpHost: string | null;
    smtpPort: number | null;
    smtpSecure: boolean;
    smtpUser: string | null;
    smtpFromName: string | null;
    smtpFromAddress: string | null;
    hasSmtpPass: boolean;
};

const LANG_OPTIONS = [
    { label: "English", value: "en" },
    { label: "Français", value: "fr" },
    { label: "Deutsch", value: "de" },
];

const TONE_OPTIONS = [
    { label: "Neutral", value: "NEUTRAL" },
    { label: "Friendly", value: "FRIENDLY" },
    { label: "Formal", value: "FORMAL" },
];

const SettingsForm: React.FC = () => {
    const authedFetch = useAuthedFetch();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [saved, setSaved] = useState(false);
    const [s, setS] = useState<SettingsDTO | null>(null);
    const [smtpPass, setSmtpPass] = useState("");
    const [smtpTest, setSmtpTest] = useState<
        { ok: boolean; message?: string } | null
    >(null);
    const [smtpTesting, setSmtpTesting] = useState(false);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const res = await authedFetch("/api/internal/settings");
                if (!res.ok) throw new Error(`load ${res.status}`);
                const data = (await res.json()) as { settings: SettingsDTO };
                if (!cancelled) setS(data.settings);
            } catch (e) {
                if (!cancelled) setError((e as Error).message);
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [authedFetch]);

    const update = <K extends keyof SettingsDTO>(
        key: K,
        value: SettingsDTO[K]
    ) => {
        setS((prev) => (prev ? { ...prev, [key]: value } : prev));
        setSaved(false);
    };

    const onTestSmtp = async () => {
        setSmtpTesting(true);
        setSmtpTest(null);
        try {
            const res = await authedFetch("/api/internal/smtp/test", {
                method: "POST",
            });
            const data = (await res.json()) as { ok: boolean; message?: string };
            setSmtpTest(data);
        } catch (e) {
            setSmtpTest({ ok: false, message: (e as Error).message });
        } finally {
            setSmtpTesting(false);
        }
    };

    const onSave = async () => {
        if (!s) return;
        setSaving(true);
        setError(null);
        try {
            const body: Record<string, unknown> = {
                autoReplyEnabled: s.autoReplyEnabled,
                responseDelaySeconds: s.responseDelaySeconds,
                language: s.language,
                tone: s.tone,
                greeting: s.greeting,
                signature: s.signature,
                supportEmail: s.supportEmail || null,
                smtpHost: s.smtpHost || null,
                smtpPort: s.smtpPort,
                smtpSecure: s.smtpSecure,
                smtpUser: s.smtpUser || null,
                smtpFromName: s.smtpFromName || null,
                smtpFromAddress: s.smtpFromAddress || null,
            };
            if (smtpPass) body.smtpPass = smtpPass;

            const res = await authedFetch("/api/internal/settings", {
                method: "PATCH",
                body: JSON.stringify(body),
            });
            if (!res.ok) throw new Error(`save ${res.status}`);
            setSaved(true);
            setSmtpPass("");
        } catch (e) {
            setError((e as Error).message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <InlineStack align="center" blockAlign="center">
                <Spinner accessibilityLabel="Loading" size="large" />
            </InlineStack>
        );
    }

    if (!s) {
        return (
            <Banner tone="critical" title="Settings unavailable">
                <p>{error ?? "No settings found for this shop."}</p>
            </Banner>
        );
    }

    return (
        <BlockStack gap="400">
            {error && (
                <Banner tone="critical" title="Error">
                    <p>{error}</p>
                </Banner>
            )}
            {saved && (
                <Banner
                    tone="success"
                    title="Settings saved"
                    onDismiss={() => setSaved(false)}
                />
            )}

            <Layout>
                <Layout.AnnotatedSection
                    title="Email intake"
                    description="Forward your support inbox to this address. Incoming tracking emails will be detected and answered automatically."
                >
                    <ForwardingInstructions inboundAddress={s.inboundAddress} />
                </Layout.AnnotatedSection>

                <Layout.AnnotatedSection
                    title="Auto-replies"
                    description="When enabled, Valyn automatically answers tracking-related emails."
                >
                    <Card>
                        <FormLayout>
                            <Checkbox
                                label="Enable auto-replies"
                                checked={s.autoReplyEnabled}
                                onChange={(v) => update("autoReplyEnabled", v)}
                            />
                            <TextField
                                label="Response delay (seconds)"
                                type="number"
                                value={String(s.responseDelaySeconds)}
                                onChange={(v) =>
                                    update(
                                        "responseDelaySeconds",
                                        Math.max(0, parseInt(v, 10) || 0)
                                    )
                                }
                                autoComplete="off"
                            />
                            <Select
                                label="Language"
                                options={LANG_OPTIONS}
                                value={s.language}
                                onChange={(v) =>
                                    update(
                                        "language",
                                        v as SettingsDTO["language"]
                                    )
                                }
                            />
                            <Select
                                label="Tone"
                                options={TONE_OPTIONS}
                                value={s.tone}
                                onChange={(v) =>
                                    update("tone", v as SettingsDTO["tone"])
                                }
                            />
                            <TextField
                                label="Greeting"
                                value={s.greeting}
                                onChange={(v) => update("greeting", v)}
                                autoComplete="off"
                            />
                            <TextField
                                label="Signature"
                                value={s.signature}
                                onChange={(v) => update("signature", v)}
                                multiline={3}
                                autoComplete="off"
                            />
                            <TextField
                                label="Support email (shown to customers)"
                                type="email"
                                value={s.supportEmail ?? ""}
                                onChange={(v) => update("supportEmail", v)}
                                autoComplete="email"
                            />
                        </FormLayout>
                    </Card>
                </Layout.AnnotatedSection>

                <Layout.AnnotatedSection
                    title="Outgoing email (SMTP)"
                    description="Replies are sent through your own mail provider so customers see your store's address."
                >
                    <Card>
                        <FormLayout>
                            <FormLayout.Group>
                                <TextField
                                    label="SMTP host"
                                    value={s.smtpHost ?? ""}
                                    onChange={(v) => update("smtpHost", v)}
                                    autoComplete="off"
                                />
                                <TextField
                                    label="Port"
                                    type="number"
                                    value={s.smtpPort?.toString() ?? ""}
                                    onChange={(v) =>
                                        update(
                                            "smtpPort",
                                            v ? parseInt(v, 10) : null
                                        )
                                    }
                                    autoComplete="off"
                                />
                            </FormLayout.Group>
                            <Checkbox
                                label="Use TLS (recommended)"
                                checked={s.smtpSecure}
                                onChange={(v) => update("smtpSecure", v)}
                            />
                            <TextField
                                label="Username"
                                value={s.smtpUser ?? ""}
                                onChange={(v) => update("smtpUser", v)}
                                autoComplete="off"
                            />
                            <TextField
                                label={
                                    s.hasSmtpPass ?
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
                                    value={s.smtpFromName ?? ""}
                                    onChange={(v) => update("smtpFromName", v)}
                                    autoComplete="off"
                                />
                                <TextField
                                    label="From address"
                                    type="email"
                                    value={s.smtpFromAddress ?? ""}
                                    onChange={(v) =>
                                        update("smtpFromAddress", v)
                                    }
                                    autoComplete="email"
                                />
                            </FormLayout.Group>
                            <InlineStack align="end" gap="200">
                                <Button
                                    onClick={onTestSmtp}
                                    loading={smtpTesting}
                                    disabled={!s.hasSmtpPass && !smtpPass}
                                >
                                    Send test connection
                                </Button>
                            </InlineStack>
                            {smtpTest && (
                                <Banner
                                    tone={smtpTest.ok ? "success" : "critical"}
                                    title={
                                        smtpTest.ok ?
                                            "SMTP connection succeeded"
                                        :   "SMTP connection failed"
                                    }
                                    onDismiss={() => setSmtpTest(null)}
                                >
                                    {smtpTest.message && <p>{smtpTest.message}</p>}
                                </Banner>
                            )}
                        </FormLayout>
                    </Card>
                </Layout.AnnotatedSection>
            </Layout>

            <InlineStack align="end">
                <Button variant="primary" loading={saving} onClick={onSave}>
                    Save
                </Button>
            </InlineStack>
        </BlockStack>
    );
};

export default SettingsForm;
