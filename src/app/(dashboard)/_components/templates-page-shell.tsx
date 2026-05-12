"use client";

import { useEffect, useState } from "react";
import { Page, Spinner } from "@shopify/polaris";
import { useAuthedFetch } from "../_lib/use-authed-fetch";
import TemplatesEditor from "./templates-editor";

const TemplatesPageShell: React.FC<{ shop: string }> = ({ shop }) => {
    const authedFetch = useAuthedFetch();
    const [canEdit, setCanEdit] = useState<boolean | null>(null);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            const res = await authedFetch("/api/internal/usage");
            if (!res.ok) {
                if (!cancelled) setCanEdit(false);
                return;
            }
            const data = (await res.json()) as {
                plan: { multipleTemplates: boolean };
            };
            if (!cancelled) setCanEdit(Boolean(data.plan.multipleTemplates));
        })();
        return () => {
            cancelled = true;
        };
    }, [authedFetch]);

    return (
        <Page
            title="Reply templates"
            subtitle={shop}
            backAction={{ url: "/dashboard" }}
        >
            {canEdit === null ? (
                <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
                    <Spinner accessibilityLabel="Loading" />
                </div>
            ) : (
                <TemplatesEditor canEdit={canEdit} />
            )}
        </Page>
    );
};

export default TemplatesPageShell;
