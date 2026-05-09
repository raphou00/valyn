import { describe, it, expect } from "vitest";
import { detectIntent, extractOrderName, isSupportedLanguage } from "./detect";

describe("detectIntent", () => {
    it.each([
        ["where is my order #1234?", "WISMO"],
        ["tracking info please", "WISMO"],
        ["bonjour, où est ma commande ?", "WISMO"],
        ["mon colis n'est pas arrivé", "WISMO"],
        ["wo ist meine bestellung", "WISMO"],
        ["lieferung verzögert?", "WISMO"],
        ["what are your store hours", "OTHER"],
        ["i'd like a refund", "OTHER"],
    ])("%s → %s", (subject, expected) => {
        expect(detectIntent(subject, "")).toBe(expected);
    });

    it("matches body when subject is generic", () => {
        expect(detectIntent("hi", "any update on my tracking?")).toBe("WISMO");
    });

    it("is case-insensitive", () => {
        expect(detectIntent("WHERE IS MY ORDER", "")).toBe("WISMO");
    });
});

describe("extractOrderName", () => {
    it.each([
        ["where is #1234?", "", "#1234"],
        ["question about order 5678", "", "#5678"],
        ["", "Re: commande 9012", "#9012"],
        ["Re: order #100", "", "#100"],
        ["item 12 status", "", null], // 2 digits — too short
        ["no order number here", "", null],
    ])("%j + %j → %j", (subject, body, expected) => {
        expect(extractOrderName(subject, body)).toBe(expected);
    });

    it("returns the first match when multiple are present", () => {
        expect(extractOrderName("orders #100 and #200", "")).toBe("#100");
    });
});

describe("isSupportedLanguage", () => {
    it.each([
        ["en", true],
        ["fr", true],
        ["de", true],
        ["es", false],
        [null, false],
        [undefined, false],
        ["", false],
    ])("%j → %s", (input, expected) => {
        expect(isSupportedLanguage(input)).toBe(expected);
    });
});
