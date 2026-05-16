import { describe, it, expect, vi, beforeEach } from "vitest";

// classifyInbound calls the real keyword detect() but a mocked LLM so no
// Bedrock call happens. These lock in the post-pre-filter behavior:
// the LLM is consulted for EVERY email, and the keyword classifier is
// strictly the fallback when the LLM is unavailable.
const { llmMock } = vi.hoisted(() => ({ llmMock: vi.fn() }));
vi.mock("./classify-llm", () => ({ classifyWithLlm: llmMock }));

import { classifyInbound } from "./pipeline";

const ALL = ["en", "fr", "de"] as const;

describe("classifyInbound", () => {
    beforeEach(() => llmMock.mockReset());

    it("consults the LLM even with zero keywords and no order ref", async () => {
        llmMock.mockResolvedValue({
            isWismo: true,
            confidence: 0.9,
            language: "en",
            orderNumber: null,
            reason: "still waiting on my stuff",
        });
        const r = await classifyInbound(
            "following up",
            "hey it's been three weeks and nothing has shown up, getting worried",
            ALL
        );
        expect(llmMock).toHaveBeenCalledOnce();
        expect(r.intent).toBe("WISMO");
        expect(r.reason).toContain("ai:");
    });

    it("falls back to the keyword verdict when the LLM is unavailable", async () => {
        llmMock.mockResolvedValue(null);
        const wismo = await classifyInbound("where is my order #1001", "", ALL);
        expect(wismo.intent).toBe("WISMO");
        const junk = await classifyInbound(
            "50% off everything this weekend",
            "shop now",
            ALL
        );
        expect(junk.intent).toBe("OTHER");
    });

    it("lets the LLM overrule a weak keyword false-positive", async () => {
        llmMock.mockResolvedValue({
            isWismo: false,
            confidence: 0.96,
            language: "en",
            orderNumber: null,
            reason: "marketing newsletter",
        });
        // "shipping" is a keyword → keyword pass alone would say WISMO.
        const r = await classifyInbound(
            "Free shipping all weekend!",
            "Don't miss our delivery deals",
            ALL
        );
        expect(r.intent).toBe("OTHER");
    });

    it("ignores an LLM language outside the plan's allowed set", async () => {
        llmMock.mockResolvedValue({
            isWismo: true,
            confidence: 0.8,
            language: "de",
            orderNumber: null,
            reason: "x",
        });
        const r = await classifyInbound("where is my order", "", ["en"]);
        expect(r.language).not.toBe("de");
    });
});
