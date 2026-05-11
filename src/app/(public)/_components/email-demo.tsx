"use client";

import { useEffect, useState } from "react";

const STEPS = [
    "Detecting intent…",
    "Intent: WISMO",
    "Looking up order #1042",
    "Reply sent",
];

const EmailDemo = () => {
    const [step, setStep] = useState(0);
    useEffect(() => {
        const t = setInterval(
            () => setStep((s) => (s + 1) % STEPS.length),
            3200
        );
        return () => clearInterval(t);
    }, []);

    return (
        <div className="demo-card" aria-hidden="true">
            <div className="demo-header">
                <div className="dots">
                    <span />
                    <span />
                    <span />
                </div>
                <span style={{ marginLeft: 6 }}>support@yourstore.com</span>
                <span
                    style={{
                        marginLeft: "auto",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        color: "#0d9b48",
                    }}
                >
                    <span
                        style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: "#21d760",
                            boxShadow: "0 0 0 4px rgba(33,215,96,0.16)",
                        }}
                    />
                    Live
                </span>
            </div>
            <div className="demo-body">
                <div className="email in">
                    <div className="meta">
                        <div className="from">
                            Sarah Patel{" "}
                            <span className="addr">
                                &lt;sarah.p@gmail.com&gt;
                            </span>
                        </div>
                        <div className="time">14:02</div>
                    </div>
                    <div className="subject">Where is my order?</div>
                    <div className="body">
                        Hi, I ordered last week and still haven&apos;t received
                        my package. My order number is #1042. Can you check?
                    </div>
                </div>

                <div className="flow-arrow">
                    <span className="tag">
                        <span className="pulse" />
                        {STEPS[step]}
                    </span>
                    <span className="line" />
                    <span className="mono" style={{ fontSize: 11 }}>
                        {((step + 1) * 0.9).toFixed(1)}s
                    </span>
                </div>

                <div className="email out">
                    <div className="meta">
                        <div className="from">
                            Valyn{" "}
                            <span className="addr">
                                on behalf of yourstore.com
                            </span>
                        </div>
                        <div className="time">14:02</div>
                    </div>
                    <div className="subject">Re: Where is my order?</div>
                    <div className="body">
                        Hi Sarah,
                        <br />
                        Your order <strong>#1042</strong> is currently in
                        transit with <strong>DHL Express</strong>.
                        <br />
                        Track it here:{" "}
                        <span
                            style={{
                                color: "#0d9b48",
                                textDecoration: "underline",
                            }}
                        >
                            track.dhl.com/EU728193…
                        </span>
                        <br />
                        Expected delivery: <strong>Thursday, May 14</strong>.
                        <br />
                        <span style={{ color: "var(--muted)" }}>
                            Thanks for your patience — the team at Yourstore.
                        </span>
                    </div>
                    <div
                        style={{
                            marginTop: 12,
                            display: "flex",
                            gap: 8,
                            alignItems: "center",
                            flexWrap: "wrap",
                        }}
                    >
                        <span className="label">Auto-reply</span>
                        <span
                            style={{
                                fontSize: 11,
                                color: "var(--muted)",
                                fontFamily: "var(--font-mono)",
                            }}
                        >
                            delivered in 3.2s
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmailDemo;
