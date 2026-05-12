"use client";

import { Button, InlineStack, Select, TextField } from "@shopify/polaris";

export type LogFilters = {
    status: string;
    intent: string;
    q: string;
    from: string;
    to: string;
};

export const EMPTY_FILTERS: LogFilters = {
    status: "",
    intent: "",
    q: "",
    from: "",
    to: "",
};

const STATUS_OPTIONS = [
    { label: "Any status", value: "" },
    { label: "Replied", value: "REPLIED" },
    { label: "Failed", value: "FAILED" },
    { label: "Ignored", value: "IGNORED" },
    { label: "Needs review", value: "REVIEW" },
    { label: "Pending", value: "PENDING" },
    { label: "Limit exceeded", value: "LIMIT_EXCEEDED" },
    { label: "Misclassified", value: "MISCLASSIFIED" },
];

const INTENT_OPTIONS = [
    { label: "Any intent", value: "" },
    { label: "WISMO", value: "WISMO" },
    { label: "Other", value: "OTHER" },
];

const LogsFilters: React.FC<{
    value: LogFilters;
    onChange: (v: LogFilters) => void;
    onReset: () => void;
}> = ({ value, onChange, onReset }) => {
    const set = <K extends keyof LogFilters>(k: K, v: LogFilters[K]) =>
        onChange({ ...value, [k]: v });
    return (
        <InlineStack gap="200" align="start" wrap>
            <div style={{ minWidth: 220, flex: 1 }}>
                <TextField
                    label="Search"
                    labelHidden
                    placeholder="Sender, subject, order…"
                    value={value.q}
                    onChange={(v) => set("q", v)}
                    autoComplete="off"
                    clearButton
                    onClearButtonClick={() => set("q", "")}
                />
            </div>
            <div style={{ minWidth: 160 }}>
                <Select
                    label="Status"
                    labelHidden
                    options={STATUS_OPTIONS}
                    value={value.status}
                    onChange={(v) => set("status", v)}
                />
            </div>
            <div style={{ minWidth: 140 }}>
                <Select
                    label="Intent"
                    labelHidden
                    options={INTENT_OPTIONS}
                    value={value.intent}
                    onChange={(v) => set("intent", v)}
                />
            </div>
            <div style={{ minWidth: 150 }}>
                <TextField
                    label="From"
                    labelHidden
                    type="date"
                    value={value.from}
                    onChange={(v) => set("from", v)}
                    autoComplete="off"
                />
            </div>
            <div style={{ minWidth: 150 }}>
                <TextField
                    label="To"
                    labelHidden
                    type="date"
                    value={value.to}
                    onChange={(v) => set("to", v)}
                    autoComplete="off"
                />
            </div>
            <Button onClick={onReset} variant="tertiary">
                Reset
            </Button>
        </InlineStack>
    );
};

export default LogsFilters;
