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
        <div
            className="relative overflow-hidden rounded-xl border border-base-300 bg-base-100 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.18)]"
            aria-hidden="true"
        >
            <div className="flex items-center gap-2 border-b border-base-300 bg-base-200 px-4 py-3 text-xs text-base-content/70">
                <div className="flex gap-1.5">
                    <span className="size-2.5 rounded-full bg-base-content/20" />
                    <span className="size-2.5 rounded-full bg-base-content/20" />
                    <span className="size-2.5 rounded-full bg-base-content/20" />
                </div>
                <span className="ml-1.5">support@yourstore.com</span>
                <span className="ml-auto inline-flex items-center gap-1.5 text-success">
                    <span className="size-1.5 rounded-full bg-success shadow-[0_0_0_4px_color-mix(in_srgb,var(--color-success)_16%,transparent)]" />
                    Live
                </span>
            </div>
            <div className="grid gap-4 p-4 sm:p-5">
                <div className="rounded-lg border border-base-300 bg-base-100 p-4">
                    <div className="mb-2 flex items-start justify-between gap-3 text-xs text-base-content/70">
                        <div className="font-medium text-base-content">
                            Sarah Patel{" "}
                            <span className="font-normal text-base-content/60">
                                &lt;sarah.p@gmail.com&gt;
                            </span>
                        </div>
                        <div className="">14:02</div>
                    </div>
                    <div className="mb-3 font-medium text-base-content">
                        Where is my order?
                    </div>
                    <div className="text-sm leading-6 text-base-content/75">
                        Hi, I ordered last week and still haven&apos;t received
                        my package. My order number is #1042. Can you check?
                    </div>
                </div>

                <div className="flex items-center gap-3 px-2 text-base-content/70">
                    <span className="inline-flex items-center gap-2 rounded-full border border-base-300 bg-base-100 px-3 py-1.5 text-sm text-base-content/70">
                        <span className="size-1.5 animate-pulse rounded-full bg-success shadow-[0_0_0_4px_color-mix(in_srgb,var(--color-success)_16%,transparent)]" />
                        {STEPS[step]}
                    </span>
                    <span className="h-px flex-1 bg-base-300" />
                    <span className=" text-[11px]">
                        {((step + 1) * 0.9).toFixed(1)}s
                    </span>
                </div>

                <div className="rounded-lg border border-base-content/10 bg-secondary p-4">
                    <div className="mb-2 flex items-start justify-between gap-3 text-xs text-base-content/70">
                        <div className="font-medium text-base-content">
                            Valyn{" "}
                            <span className="font-normal text-base-content/60">
                                on behalf of yourstore.com
                            </span>
                        </div>
                        <div className="">14:02</div>
                    </div>
                    <div className="mb-3 font-medium text-base-content">
                        Re: Where is my order?
                    </div>
                    <div className="text-sm leading-6 text-base-content/80">
                        Hi Sarah,
                        <br />
                        Your order <strong>#1042</strong> is currently in
                        transit with <strong>DHL Express</strong>.
                        <br />
                        Track it here:{" "}
                        <span className="text-base-content underline">
                            track.dhl.com/EU728193…
                        </span>
                        <br />
                        Expected delivery: <strong>Thursday, May 14</strong>.
                        <br />
                        <span className="text-base-content/70">
                            Thanks for your patience — the team at Yourstore.
                        </span>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span className="inline-flex rounded-full bg-base-content px-2.5 py-1 text-xs font-medium text-base-100">
                            Auto-reply
                        </span>
                        <span className=" text-[11px] text-base-content/70">
                            delivered in 3.2s
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmailDemo;
