"use client";

import { useEffect, useState, type ReactNode } from "react";
import { cn, pillClass } from "./site-shell";

const STEPS: { n: string; t: string }[] = [
    { n: "01", t: "Customer email" },
    { n: "02", t: "Detection" },
    { n: "03", t: "Order lookup" },
    { n: "04", t: "Reply drafted" },
    { n: "05", t: "Reply sent" },
];

const panelClass =
    "overflow-hidden rounded-xl border border-base-300 bg-base-100 shadow-[0_8px_8px_rgba(0,0,0,0.08),0_4px_4px_rgba(0,0,0,0.06),0_2px_2px_rgba(0,0,0,0.05)]";
const panelHeaderClass =
    "flex items-center justify-between gap-3 border-b border-base-300 bg-base-200 px-4 py-3 text-xs font-medium text-base-content/70";
const panelBodyClass = "p-5 text-sm leading-7 text-base-content/80";
const lookupCellClass = "rounded-lg border border-base-300 bg-base-200 p-3";
const lookupKeyClass =
    "text-xs font-medium uppercase tracking-[0.06em] text-base-content/60";
const lookupValueClass = "mt-1 text-sm font-medium text-base-content";

const Inbound = () => (
    <div className={panelClass}>
        <div className={panelHeaderClass}>
            <span>Inbound — sarah.p@gmail.com</span>
            <span>14:02</span>
        </div>
        <div className={panelBodyClass}>
            <div className="mb-1 font-medium text-base-content">
                To: support@yourstore.com
            </div>
            <div className="mb-3 font-medium text-base-content">
                Subject: Where is my order?
            </div>
            <p>
                Hi, I ordered last week and still haven&apos;t received my
                package. My order number is <strong>#1042</strong>. Can you
                check?
            </p>
            <p className="mt-2 text-base-content/70">
                Thanks,
                <br />
                Sarah
            </p>
        </div>
    </div>
);

const PanelAwaiting = () => (
    <div className={panelClass}>
        <div className={panelHeaderClass}>
            <span>Awaiting events…</span>
            <span>—</span>
        </div>
        <div className={panelBodyClass}>
            <div className="inline-flex items-center gap-2 text-base-content/70">
                <span className="size-1.5 rounded-full bg-success" />
                Email forwarded to your Valyn address
            </div>
            <div className="mt-3.5 text-xs leading-6 text-base-content/60">
                inbound.getvalyn.com
                <br />↓ SES receives MIME
                <br />↓ S3 stores blob
                <br />↓ SNS triggers pipeline
            </div>
        </div>
    </div>
);

const PanelDetect = () => (
    <div className={panelClass}>
        <div className={panelHeaderClass}>
            <span>classify.intent</span>
            <span className="">0.42s</span>
        </div>
        <div className={panelBodyClass}>
            <div className=" text-[13px] leading-7 text-base-content">
                <div>
                    scan_keywords([
                    <span className="text-base-content">
                        &quot;where is&quot;
                    </span>
                    , &quot;tracking&quot;, &quot;commande&quot;])
                </div>
                <div className="text-base-content/60">
                    → matched: &quot;where is&quot;, &quot;order #&quot;
                </div>
                <div>
                    language: <span>EN</span>
                </div>
                <div>
                    intent:{" "}
                    <span className={`${pillClass("ok")} ml-1`}>WISMO</span>
                </div>
                <div>
                    confidence: <span>0.94</span>
                </div>
            </div>
        </div>
    </div>
);

const PanelLookup = () => (
    <div className={panelClass}>
        <div className={panelHeaderClass}>
            <span>order.lookup</span>
            <span className="">1.08s</span>
        </div>
        <div className={panelBodyClass}>
            <div className="grid gap-3 sm:grid-cols-2">
                <div className={lookupCellClass}>
                    <div className={lookupKeyClass}>Order</div>
                    <div className={lookupValueClass}>#1042</div>
                </div>
                <div className={lookupCellClass}>
                    <div className={lookupKeyClass}>Status</div>
                    <div className={lookupValueClass}>in_transit</div>
                </div>
                <div className={lookupCellClass}>
                    <div className={lookupKeyClass}>Carrier</div>
                    <div className={lookupValueClass}>DHL Express</div>
                </div>
                <div className={lookupCellClass}>
                    <div className={lookupKeyClass}>Tracking</div>
                    <div className={lookupValueClass}>EU728193…</div>
                </div>
                <div className={`${lookupCellClass} sm:col-span-2`}>
                    <div className={lookupKeyClass}>ETA</div>
                    <div className={lookupValueClass}>Thursday, May 14</div>
                </div>
            </div>
        </div>
    </div>
);

const PanelReply = ({ sent }: { sent: boolean }) => (
    <div className={panelClass}>
        <div className={panelHeaderClass}>
            <span>{sent ? "reply.sent" : "reply.draft"}</span>
            <span className="">{sent ? "delivered ✓" : "drafting…"}</span>
        </div>
        <div className={panelBodyClass}>
            <div className="text-[13px] leading-7 text-base-content">
                <div className="font-medium">From: support@yourstore.com</div>
                <div className="mb-2.5 font-medium">
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
                    <span className="text-base-content underline">
                        track.dhl.com/EU728193…
                    </span>
                    <br />
                    Expected delivery: <strong>Thursday, May 14</strong>.
                </div>
                <div className="mt-3.5 inline-flex flex-wrap items-center gap-2">
                    <span className={pillClass(sent ? "ok" : "warn")}>
                        {sent ? "● Sent" : "● Draft"}
                    </span>
                    <span className=" text-[11px] text-base-content/60">
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
        <div className={panelClass}>
            <div className="grid gap-2 border-b border-base-300 bg-base-200 p-4 md:grid-cols-5">
                {STEPS.map((s, i) => (
                    <button
                        key={s.n}
                        type="button"
                        className={cn(
                            "rounded-lg border px-3 py-2 text-left transition",
                            i === step &&
                                "border-base-content bg-base-content text-base-100",
                            i < step &&
                                i !== step &&
                                "border-base-content/20 bg-secondary text-base-content",
                            i > step &&
                                "border-base-300 bg-base-100 text-base-content/70"
                        )}
                        onClick={() => {
                            setAuto(false);
                            setStep(i);
                        }}
                    >
                        <div className=" text-xs font-medium">{s.n}</div>
                        <div className="mt-1 text-sm font-medium">{s.t}</div>
                    </button>
                ))}
            </div>
            <div className="grid gap-4 p-4 lg:grid-cols-2">
                <Inbound />
                <RightPanel step={step} />
            </div>
            <div className="flex flex-wrap justify-end gap-2 border-t border-base-300 p-4">
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
