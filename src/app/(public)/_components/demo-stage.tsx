"use client";

import { useEffect, useState, type ReactNode } from "react";

const STEPS: { n: string; t: string }[] = [
    { n: "01", t: "Customer email" },
    { n: "02", t: "Detection" },
    { n: "03", t: "Order lookup" },
    { n: "04", t: "Reply drafted" },
    { n: "05", t: "Reply sent" },
];

const Inbound = () => (
    <div className="stage-panel">
        <div className="ph">
            <span>Inbound — sarah.p@gmail.com</span>
            <span>14:02</span>
        </div>
        <div className="pb">
            <div style={{ fontSize: 13, fontWeight: 540, marginBottom: 4 }}>
                To: support@yourstore.com
            </div>
            <div style={{ fontSize: 13, fontWeight: 540, marginBottom: 12 }}>
                Subject: Where is my order?
            </div>
            <p style={{ margin: 0, color: "var(--ink-2)" }}>
                Hi, I ordered last week and still haven&apos;t received my
                package. My order number is <strong>#1042</strong>. Can you
                check?
            </p>
            <p style={{ marginTop: 8, color: "var(--muted)" }}>
                Thanks,
                <br />
                Sarah
            </p>
        </div>
    </div>
);

const PanelAwaiting = () => (
    <div className="stage-panel">
        <div className="ph">
            <span>Awaiting events…</span>
            <span>—</span>
        </div>
        <div className="pb" style={{ color: "var(--muted)" }}>
            <div
                style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
            >
                <span
                    style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "var(--green)",
                        animation: "valyn-pulse 1.6s infinite",
                    }}
                />
                Email forwarded to your Valyn address
            </div>
            <div
                style={{
                    marginTop: 14,
                    fontFamily: "var(--font-mono)",
                    fontSize: 12,
                    color: "var(--muted-2)",
                }}
            >
                inbound.getvalyn.com
                <br />↓ SES receives MIME
                <br />↓ S3 stores blob
                <br />↓ SNS triggers pipeline
            </div>
        </div>
    </div>
);

const PanelDetect = () => (
    <div className="stage-panel">
        <div className="ph">
            <span>classify.intent</span>
            <span className="mono">0.42s</span>
        </div>
        <div className="pb">
            <div
                style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 13,
                    lineHeight: 1.8,
                }}
            >
                <div>
                    scan_keywords([
                    <span style={{ color: "var(--green-deep)" }}>
                        &quot;where is&quot;
                    </span>
                    , &quot;tracking&quot;, &quot;commande&quot;])
                </div>
                <div style={{ color: "var(--muted)" }}>
                    → matched: &quot;where is&quot;, &quot;order #&quot;
                </div>
                <div>
                    language: <span style={{ color: "var(--ink)" }}>EN</span>
                </div>
                <div>
                    intent:{" "}
                    <span className="pill ok" style={{ marginLeft: 4 }}>
                        WISMO
                    </span>
                </div>
                <div>
                    confidence:{" "}
                    <span style={{ color: "var(--ink)" }}>0.94</span>
                </div>
            </div>
        </div>
    </div>
);

const PanelLookup = () => (
    <div className="stage-panel">
        <div className="ph">
            <span>order.lookup</span>
            <span className="mono">1.08s</span>
        </div>
        <div className="pb">
            <div className="lookup-grid">
                <div className="lookup-cell">
                    <div className="k">Order</div>
                    <div className="v">#1042</div>
                </div>
                <div className="lookup-cell">
                    <div className="k">Status</div>
                    <div className="v">in_transit</div>
                </div>
                <div className="lookup-cell">
                    <div className="k">Carrier</div>
                    <div className="v">DHL Express</div>
                </div>
                <div className="lookup-cell">
                    <div className="k">Tracking</div>
                    <div className="v">EU728193…</div>
                </div>
                <div className="lookup-cell" style={{ gridColumn: "1 / -1" }}>
                    <div className="k">ETA</div>
                    <div className="v">Thursday, May 14</div>
                </div>
            </div>
        </div>
    </div>
);

const PanelReply = ({ sent }: { sent: boolean }) => (
    <div className="stage-panel">
        <div className="ph">
            <span>{sent ? "reply.sent" : "reply.draft"}</span>
            <span className="mono">{sent ? "delivered ✓" : "drafting…"}</span>
        </div>
        <div className="pb">
            <div style={{ fontSize: 13, color: "var(--ink-2)" }}>
                <div style={{ fontWeight: 540 }}>
                    From: support@yourstore.com
                </div>
                <div style={{ fontWeight: 540, marginBottom: 10 }}>
                    Subject: Re: Where is my order?
                </div>
                <div>
                    Hi Sarah,
                    <br />
                    <br />
                    Your order <strong>#1042</strong> is currently in transit
                    with <strong>DHL Express</strong>.
                    <br />
                    Track it here:{" "}
                    <span
                        style={{
                            color: "var(--green-deep)",
                            textDecoration: "underline",
                        }}
                    >
                        track.dhl.com/EU728193…
                    </span>
                    <br />
                    Expected delivery: <strong>Thursday, May 14</strong>.
                </div>
                <div
                    style={{
                        marginTop: 14,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                    }}
                >
                    <span className={`pill ${sent ? "ok" : "warn"}`}>
                        {sent ? "● Sent" : "● Draft"}
                    </span>
                    <span
                        style={{
                            fontSize: 11,
                            color: "var(--muted)",
                            fontFamily: "var(--font-mono)",
                        }}
                    >
                        {sent ? "3.2s end-to-end" : "awaiting send"}
                    </span>
                </div>
            </div>
        </div>
    </div>
);

const RightPanel = ({ step }: { step: number }): ReactNode => {
    if (step === 0) return <PanelAwaiting />;
    if (step === 1) return <PanelDetect />;
    if (step === 2) return <PanelLookup />;
    return <PanelReply sent={step === 4} />;
};

const DemoStage = () => {
    const [step, setStep] = useState(0);
    const [auto, setAuto] = useState(true);

    useEffect(() => {
        if (!auto) return;
        const t = setInterval(
            () => setStep((s) => (s + 1) % STEPS.length),
            2400
        );
        return () => clearInterval(t);
    }, [auto]);

    return (
        <div className="demo-stage">
            <div className="demo-flow">
                {STEPS.map((s, i) => {
                    const klass =
                        i === step ? "current"
                        : i < step ? "done"
                        : "";
                    return (
                        <button
                            key={s.n}
                            type="button"
                            className={`demo-step ${klass}`.trim()}
                            onClick={() => {
                                setAuto(false);
                                setStep(i);
                            }}
                        >
                            <div className="n">{s.n}</div>
                            <div className="t">{s.t}</div>
                        </button>
                    );
                })}
            </div>
            <div className="stage-body">
                <Inbound />
                <RightPanel step={step} />
            </div>
            <div className="controls">
                <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => {
                        setAuto(false);
                        setStep((s) => Math.max(0, s - 1));
                    }}
                >
                    ← Previous
                </button>
                <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                        setAuto(false);
                        setStep((s) => (s + 1) % STEPS.length);
                    }}
                >
                    Next →
                </button>
                <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => setAuto((a) => !a)}
                >
                    {auto ? "Pause auto-play" : "Resume auto-play"}
                </button>
            </div>
        </div>
    );
};

export default DemoStage;
