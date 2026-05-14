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
import SmtpSection from "./smtp-section";
import OnboardingWizard from "./onboarding-wizard";
import {
    SMTP_PROVIDERS,
    detectSmtpProvider,
    type SmtpProviderKey,
} from "@/lib/smtp-providers";

type SettingsDTO = {
    autoReplyEnabled: boolean;
    responseDelaySeconds: number;
    language: "en" | "fr" | "de";
    tone: "NEUTRAL" | "FRIENDLY" | "FORMAL";
    strictness: "AUTO_REPLY" | "REVIEW_QUEUE" | "PASS_THROUGH";
    fallbackBehavior: "SEND_FALLBACK" | "QUEUE_REVIEW" | "SKIP";
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
    smtpLastVerifiedAt: string | null;
    smtpLastError: string | null;
};

type PlanCaps = {
    key: string | null;
    languages: string[];
    toneControl: boolean;
    manualReviewMode: boolean;
    multipleTemplates: boolean;
};

const LANG_LABELS: Record<string, string> = {
    en: "English",
    fr: "Français",
    de: "Deutsch",
};

const TONE_OPTIONS = [
    { label: "Neutral", value: "NEUTRAL" },
    { label: "Friendly", value: "FRIENDLY" },
    { label: "Formal", value: "FORMAL" },
];

const STRICTNESS_OPTIONS = [
    { label: "Auto-reply (recommended)", value: "AUTO_REPLY" },
    { label: "Queue every email for manual review", value: "REVIEW_QUEUE" },
    {
        label: "Pass through — never reply automatically",
        value: "PASS_THROUGH",
    },
];

const FALLBACK_OPTIONS = [
    { label: "Send a polite fallback reply", value: "SEND_FALLBACK" },
    { label: "Queue for manual review", value: "QUEUE_REVIEW" },
    { label: "Skip (don't reply, just log)", value: "SKIP" },
];

const SettingsForm: React.FC = () => {
    const authedFetch = useAuthedFetch();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [saved, setSaved] = useState(false);
    const [s, setS] = useState<SettingsDTO | null>(null);
    const [plan, setPlan] = useState<PlanCaps | null>(null);
    const [smtpPass, setSmtpPass] = useState("");
    const [smtpTest, setSmtpTest] = useState<{
        ok: boolean;
        message?: string;
        sentTo?: string;
    } | null>(null);
    const [smtpTesting, setSmtpTesting] = useState(false);
    const [provider, setProvider] = useState<SmtpProviderKey>("other");
    const [showAppPwHelp, setShowAppPwHelp] = useState(false);
    const [wizardDismissed, setWizardDismissed] = useState(false);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const res = await authedFetch("/api/internal/settings");
                if (!res.ok) throw new Error(`load ${res.status}`);
                const data = (await res.json()) as {
                    settings: SettingsDTO;
                    plan: PlanCaps;
                };
                if (!cancelled) {
                    setS(data.settings);
                    setPlan(data.plan);
                    setProvider(detectSmtpProvider(data.settings.smtpHost));
                }
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

    const onProviderChange = (next: SmtpProviderKey) => {
        setProvider(next);
        setSaved(false);
        if (next === "other") return;
        const p = SMTP_PROVIDERS[next];
        setS((prev) =>
            prev ?
                {
                    ...prev,
                    smtpHost: p.host,
                    smtpPort: p.port,
                    smtpSecure: p.secure,
                    smtpUser: prev.smtpFromAddress ?? prev.smtpUser,
                }
            :   prev
        );
    };

    const onSaveSmtp = async () => {
        if (!s) return;
        setSmtpTesting(true);
        setSmtpTest(null);
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
            setSmtpTest(data);
            const sr = await authedFetch("/api/internal/settings");
            if (sr.ok) {
                const sd = (await sr.json()) as { settings: SettingsDTO };
                setS(sd.settings);
            }
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
                strictness: s.strictness,
                fallbackBehavior: s.fallbackBehavior,
                greeting: s.greeting,
                signature: s.signature,
                supportEmail: s.supportEmail || null,
            };

            const res = await authedFetch("/api/internal/settings", {
                method: "PATCH",
                body: JSON.stringify(body),
            });
            if (!res.ok) {
                const data = (await res.json()) as { message?: string };
                throw new Error(data.message ?? `save ${res.status}`);
            }
            setSaved(true);
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

    const smtpConfigured = Boolean(
        s.smtpHost && s.smtpUser && s.smtpFromAddress && s.hasSmtpPass
    );
    if (!smtpConfigured && !wizardDismissed) {
        return (
            <OnboardingWizard
                settings={s}
                onDone={() => setWizardDismissed(true)}
            />
        );
    }

    const langOptions = (plan?.languages ?? ["en", "fr", "de"]).map((l) => ({
        label: LANG_LABELS[l] ?? l,
        value: l,
    }));
    const strictnessOptions =
        plan?.manualReviewMode ? STRICTNESS_OPTIONS : (
            STRICTNESS_OPTIONS.filter((o) => o.value !== "REVIEW_QUEUE")
        );

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
                                helpText="Paused emails are still logged so you can review them."
                                checked={s.autoReplyEnabled}
                                onChange={(v) => update("autoReplyEnabled", v)}
                            />
                            <Select
                                label="Detection strictness"
                                helpText="Controls what Valyn does after detecting a WISMO email."
                                options={strictnessOptions}
                                value={s.strictness}
                                onChange={(v) =>
                                    update(
                                        "strictness",
                                        v as SettingsDTO["strictness"]
                                    )
                                }
                            />
                            <Select
                                label="When no order is found"
                                options={FALLBACK_OPTIONS}
                                value={s.fallbackBehavior}
                                onChange={(v) =>
                                    update(
                                        "fallbackBehavior",
                                        v as SettingsDTO["fallbackBehavior"]
                                    )
                                }
                            />
                            <TextField
                                label="Response delay (seconds)"
                                helpText="Up to 60 seconds. Longer delays require the Pro background queue (coming soon)."
                                type="number"
                                value={String(s.responseDelaySeconds)}
                                onChange={(v) =>
                                    update(
                                        "responseDelaySeconds",
                                        Math.max(
                                            0,
                                            Math.min(60, parseInt(v, 10) || 0)
                                        )
                                    )
                                }
                                autoComplete="off"
                            />
                            <Select
                                label="Reply language"
                                helpText={
                                    plan && plan.languages.length === 1 ?
                                        "Pro plan unlocks French and German."
                                    :   "Valyn auto-detects each customer's language and replies in it."
                                }
                                options={langOptions}
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
                                helpText={
                                    plan?.toneControl ?
                                        "Soft tone wrapper around the reply body. Greeting/signature stay yours."
                                    :   "Pro plan unlocks Friendly and Formal tones."
                                }
                                options={
                                    plan?.toneControl ? TONE_OPTIONS : (
                                        [TONE_OPTIONS[0]]
                                    )
                                }
                                value={s.tone}
                                onChange={(v) =>
                                    update("tone", v as SettingsDTO["tone"])
                                }
                                disabled={!plan?.toneControl}
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
                    title="Outgoing email"
                    description="Replies are sent through your own mail provider so customers see your store's address."
                >
                    <SmtpSection
                        values={s}
                        smtpPass={smtpPass}
                        setSmtpPass={setSmtpPass}
                        provider={provider}
                        onProviderChange={onProviderChange}
                        showHelp={showAppPwHelp}
                        onToggleHelp={() => setShowAppPwHelp((v) => !v)}
                        updateField={(k, v) =>
                            update(
                                k as keyof SettingsDTO,
                                v as SettingsDTO[keyof SettingsDTO]
                            )
                        }
                        onTestAndSave={onSaveSmtp}
                        testing={smtpTesting}
                        test={smtpTest}
                        dismissTest={() => setSmtpTest(null)}
                    />
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
