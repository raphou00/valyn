"use client";

import { useState } from "react";
import { Banner, Button } from "@shopify/polaris";
import { useAuthedFetch } from "../_lib/use-authed-fetch";

type Props = {
    status:
        | "PENDING"
        | "ACTIVE"
        | "CANCELLED"
        | "DECLINED"
        | "EXPIRED"
        | "FROZEN"
        | null;
};

const TITLES: Record<string, string> = {
    NULL: "Choose a plan to start sending replies",
    PENDING: "Subscription pending — confirm to activate",
    CANCELLED: "Subscription cancelled — reactivate to resume",
    DECLINED: "Subscription declined — choose a plan to continue",
    EXPIRED: "Subscription expired — renew to resume",
    FROZEN: "Subscription frozen — please update your billing",
};

const BillingBanner: React.FC<Props> = ({ status }) => {
    const authedFetch = useAuthedFetch();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (status === "ACTIVE") return null;

    const onSubscribe = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await authedFetch("/api/internal/billing/start", {
                method: "POST",
            });
            if (!res.ok) throw new Error(`start ${res.status}`);
            const { confirmationUrl } = (await res.json()) as {
                confirmationUrl: string;
            };
            // Top-frame redirect: the Shopify charge approval page must replace
            // the whole admin frame, not load inside our embedded iframe.
            if (window.top) {
                window.top.location.href = confirmationUrl;
            } else {
                window.location.href = confirmationUrl;
            }
        } catch (e) {
            setError((e as Error).message);
            setLoading(false);
        }
    };

    return (
        <Banner
            tone={status === "PENDING" ? "info" : "warning"}
            title={TITLES[status ?? "NULL"] ?? TITLES.NULL}
        >
            <p>
                Auto-replies are paused until your subscription is active.
                Includes a 14-day free trial.
            </p>
            <div style={{ marginTop: 12 }}>
                <Button onClick={onSubscribe} loading={loading} variant="primary">
                    {status === "PENDING" ? "Resume approval" : "Subscribe"}
                </Button>
            </div>
            {error && (
                <p style={{ marginTop: 8, color: "var(--p-color-text-critical)" }}>
                    {error}
                </p>
            )}
        </Banner>
    );
};

export default BillingBanner;
