import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the Bedrock client so no network call happens. `sendMock` lets each
// test drive the model's raw text response (or throw). vi.hoisted keeps it
// initialized before the hoisted vi.mock factory runs.
const { sendMock } = vi.hoisted(() => ({ sendMock: vi.fn() }));
vi.mock("@aws-sdk/client-bedrock-runtime", () => ({
    BedrockRuntimeClient: class {
        send = sendMock;
    },
    ConverseCommand: class {
        constructor(public input: unknown) {}
    },
}));

import { classifyWithLlm } from "./classify-llm";

const reply = (text: string) => ({
    output: { message: { content: [{ text }] } },
});

describe("classifyWithLlm", () => {
    beforeEach(() => sendMock.mockReset());

    it("parses a WISMO verdict", async () => {
        sendMock.mockResolvedValue(
            reply(
                '{"isWismo":true,"confidence":0.94,"language":"en","orderNumber":"#1001","reason":"asking about delivery"}'
            )
        );
        const r = await classifyWithLlm("Where is my order #1001?", "hello");
        expect(r).not.toBeNull();
        expect(r!.isWismo).toBe(true);
        expect(r!.confidence).toBeCloseTo(0.94);
        expect(r!.language).toBe("en");
        expect(r!.orderNumber).toBe("#1001");
    });

    it("classifies a marketing email as not WISMO", async () => {
        sendMock.mockResolvedValue(
            reply(
                '{"isWismo":false,"confidence":0.97,"language":"en","orderNumber":null,"reason":"newsletter"}'
            )
        );
        const r = await classifyWithLlm(
            "FREE SHIPPING this weekend only!",
            "Shop our delivery deals"
        );
        expect(r!.isWismo).toBe(false);
    });

    it("tolerates prose around the JSON", async () => {
        sendMock.mockResolvedValue(
            reply(
                'Here you go: {"isWismo":true,"confidence":0.8,"language":"fr","orderNumber":null,"reason":"x"} done'
            )
        );
        const r = await classifyWithLlm("où est ma commande", "");
        expect(r!.isWismo).toBe(true);
        expect(r!.language).toBe("fr");
    });

    it("returns null on malformed output", async () => {
        sendMock.mockResolvedValue(reply("not json at all"));
        expect(await classifyWithLlm("hi", "")).toBeNull();
    });

    it("returns null when the model errors (throttled/down)", async () => {
        sendMock.mockRejectedValueOnce(new Error("ThrottlingException"));
        await expect(classifyWithLlm("hi", "")).resolves.toBeNull();
    });

    it("clamps an out-of-range confidence", async () => {
        sendMock.mockResolvedValue(
            reply(
                '{"isWismo":true,"confidence":5,"language":null,"orderNumber":null,"reason":"x"}'
            )
        );
        const r = await classifyWithLlm("tracking?", "");
        expect(r!.confidence).toBe(1);
        expect(r!.language).toBeNull();
    });
});
