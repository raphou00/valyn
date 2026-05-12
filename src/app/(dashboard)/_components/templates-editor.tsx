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
    InlineStack,
    Layout,
    Select,
    Spinner,
    Text,
    TextField,
} from "@shopify/polaris";
import { useAuthedFetch } from "../_lib/use-authed-fetch";

type TemplateType = "IN_TRANSIT" | "PROCESSING" | "NO_ORDER" | "MULTIPLE";

type ReplyTemplate = {
    id: string;
    type: TemplateType;
    name: string;
    body: string;
    isDefault: boolean;
};

const TYPE_LABEL: Record<TemplateType, string> = {
    IN_TRANSIT: "Order in transit",
    PROCESSING: "Order processing",
    NO_ORDER: "Order not found",
    MULTIPLE: "Multiple matching orders",
};

const DEFAULT_BODY: Record<TemplateType, string> = {
    IN_TRANSIT:
        "Your order {{orderName}} is on its way with {{carrier}}.\nTrack: {{tracking}}",
    PROCESSING:
        "Your order {{orderName}} is being prepared and will ship shortly.",
    NO_ORDER:
        "We couldn't find your order. Please reply with your order number so we can help.",
    MULTIPLE:
        "You have several recent orders — this update is for {{orderName}}.",
};

const TYPE_OPTIONS: { label: string; value: TemplateType }[] = (
    Object.keys(TYPE_LABEL) as TemplateType[]
).map((t) => ({ label: TYPE_LABEL[t], value: t }));

const TemplatesEditor: React.FC<{
    canEdit: boolean;
}> = ({ canEdit }) => {
    const authedFetch = useAuthedFetch();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [templates, setTemplates] = useState<ReplyTemplate[]>([]);
    const [draft, setDraft] = useState<{
        type: TemplateType;
        name: string;
        body: string;
    }>({ type: "IN_TRANSIT", name: "", body: DEFAULT_BODY.IN_TRANSIT });
    const [saving, setSaving] = useState(false);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await authedFetch("/api/internal/templates");
            if (!res.ok) throw new Error(`load ${res.status}`);
            const data = (await res.json()) as { templates: ReplyTemplate[] };
            setTemplates(data.templates);
        } catch (e) {
            setError((e as Error).message);
        } finally {
            setLoading(false);
        }
    }, [authedFetch]);

    useEffect(() => {
        void load();
    }, [load]);

    const grouped = useMemo(() => {
        const by: Record<TemplateType, ReplyTemplate[]> = {
            IN_TRANSIT: [],
            PROCESSING: [],
            NO_ORDER: [],
            MULTIPLE: [],
        };
        for (const t of templates) by[t.type].push(t);
        return by;
    }, [templates]);

    const create = async () => {
        setSaving(true);
        setError(null);
        try {
            const res = await authedFetch("/api/internal/templates", {
                method: "POST",
                body: JSON.stringify({ ...draft, isDefault: true }),
            });
            if (!res.ok) {
                const data = (await res.json()) as { message?: string };
                throw new Error(data.message ?? `create ${res.status}`);
            }
            setDraft({
                type: draft.type,
                name: "",
                body: DEFAULT_BODY[draft.type],
            });
            await load();
        } catch (e) {
            setError((e as Error).message);
        } finally {
            setSaving(false);
        }
    };

    const setDefault = async (tpl: ReplyTemplate) => {
        const res = await authedFetch(
            `/api/internal/templates/${encodeURIComponent(tpl.id)}`,
            {
                method: "PATCH",
                body: JSON.stringify({ isDefault: true }),
            }
        );
        if (res.ok) await load();
    };

    const remove = async (tpl: ReplyTemplate) => {
        const res = await authedFetch(
            `/api/internal/templates/${encodeURIComponent(tpl.id)}`,
            { method: "DELETE" }
        );
        if (res.ok) await load();
    };

    if (!canEdit) {
        return (
            <Card>
                <EmptyState
                    heading="Multiple templates is a Pro feature"
                    image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
                >
                    <p>
                        Upgrade to Pro to author per-scenario reply templates
                        for in-transit, processing, no-order-found, and
                        multiple-order cases.
                    </p>
                </EmptyState>
            </Card>
        );
    }

    if (loading) {
        return (
            <InlineStack align="center" blockAlign="center">
                <Box padding="600">
                    <Spinner accessibilityLabel="Loading" />
                </Box>
            </InlineStack>
        );
    }

    return (
        <BlockStack gap="400">
            {error && (
                <Banner tone="critical" title="Error">
                    <p>{error}</p>
                </Banner>
            )}

            <Layout>
                <Layout.AnnotatedSection
                    title="Add a template"
                    description={
                        "Use {{orderName}}, {{carrier}}, and {{tracking}} as placeholders. They're filled in at send time."
                    }
                >
                    <Card>
                        <BlockStack gap="300">
                            <Select
                                label="Scenario"
                                options={TYPE_OPTIONS}
                                value={draft.type}
                                onChange={(v) =>
                                    setDraft((d) => ({
                                        ...d,
                                        type: v as TemplateType,
                                        body:
                                            d.body === DEFAULT_BODY[d.type]
                                                ? DEFAULT_BODY[v as TemplateType]
                                                : d.body,
                                    }))
                                }
                            />
                            <TextField
                                label="Name"
                                value={draft.name}
                                onChange={(v) =>
                                    setDraft((d) => ({ ...d, name: v }))
                                }
                                autoComplete="off"
                                placeholder="e.g. Standard in-transit reply"
                            />
                            <TextField
                                label="Body"
                                value={draft.body}
                                onChange={(v) =>
                                    setDraft((d) => ({ ...d, body: v }))
                                }
                                multiline={6}
                                autoComplete="off"
                            />
                            <InlineStack align="end">
                                <Button
                                    variant="primary"
                                    loading={saving}
                                    onClick={create}
                                    disabled={!draft.name || !draft.body}
                                >
                                    Save template
                                </Button>
                            </InlineStack>
                        </BlockStack>
                    </Card>
                </Layout.AnnotatedSection>

                <Layout.AnnotatedSection
                    title="Your templates"
                    description="The default for each scenario is used by the pipeline."
                >
                    <BlockStack gap="300">
                        {(Object.keys(TYPE_LABEL) as TemplateType[]).map(
                            (type) => (
                                <Card key={type}>
                                    <BlockStack gap="200">
                                        <Text as="h3" variant="headingSm">
                                            {TYPE_LABEL[type]}
                                        </Text>
                                        {grouped[type].length === 0 ? (
                                            <Text
                                                as="p"
                                                tone="subdued"
                                                variant="bodySm"
                                            >
                                                Using the built-in default for
                                                this scenario.
                                            </Text>
                                        ) : (
                                            grouped[type].map((tpl) => (
                                                <Box
                                                    key={tpl.id}
                                                    padding="300"
                                                    background="bg-surface-secondary"
                                                    borderRadius="200"
                                                >
                                                    <InlineStack
                                                        align="space-between"
                                                        blockAlign="center"
                                                    >
                                                        <InlineStack gap="200" blockAlign="center">
                                                            <Text
                                                                as="p"
                                                                variant="bodyMd"
                                                                fontWeight="semibold"
                                                            >
                                                                {tpl.name}
                                                            </Text>
                                                            {tpl.isDefault && (
                                                                <Badge tone="success">
                                                                    Default
                                                                </Badge>
                                                            )}
                                                        </InlineStack>
                                                        <InlineStack gap="100">
                                                            {!tpl.isDefault && (
                                                                <Button
                                                                    onClick={() =>
                                                                        setDefault(
                                                                            tpl
                                                                        )
                                                                    }
                                                                    variant="plain"
                                                                >
                                                                    Make default
                                                                </Button>
                                                            )}
                                                            <Button
                                                                onClick={() =>
                                                                    remove(tpl)
                                                                }
                                                                variant="plain"
                                                                tone="critical"
                                                            >
                                                                Delete
                                                            </Button>
                                                        </InlineStack>
                                                    </InlineStack>
                                                    <Box paddingBlockStart="200">
                                                        <Text
                                                            as="p"
                                                            variant="bodySm"
                                                            tone="subdued"
                                                        >
                                                            <span
                                                                style={{
                                                                    whiteSpace:
                                                                        "pre-wrap",
                                                                }}
                                                            >
                                                                {tpl.body}
                                                            </span>
                                                        </Text>
                                                    </Box>
                                                </Box>
                                            ))
                                        )}
                                    </BlockStack>
                                </Card>
                            )
                        )}
                    </BlockStack>
                </Layout.AnnotatedSection>
            </Layout>
        </BlockStack>
    );
};

export default TemplatesEditor;
