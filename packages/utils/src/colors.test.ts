import { describe, expect, test } from "@jest/globals";
import { getContrastFromHSLA } from "./colors";

describe("getContrastFromHSLA", () => {
    describe("returns 'black' for light colors", () => {
        test("pure white hsl(0, 0%, 100%)", () => {
            expect(getContrastFromHSLA("hsl(0, 0%, 100%)")).toBe("black");
        });

        test("white with alpha hsla(0, 0%, 100%, 1)", () => {
            expect(getContrastFromHSLA("hsla(0, 0%, 100%, 1)")).toBe("black");
        });

        test("light yellow hsl(60, 100%, 80%)", () => {
            expect(getContrastFromHSLA("hsl(60, 100%, 80%)")).toBe("black");
        });

        test("light gray hsl(0, 0%, 80%)", () => {
            expect(getContrastFromHSLA("hsl(0, 0%, 80%)")).toBe("black");
        });

        test("light cyan hsl(180, 80%, 75%)", () => {
            expect(getContrastFromHSLA("hsl(180, 80%, 75%)")).toBe("black");
        });

        test("light green hsl(120, 60%, 70%)", () => {
            expect(getContrastFromHSLA("hsl(120, 60%, 70%)")).toBe("black");
        });
    });

    describe("returns 'white' for dark colors", () => {
        test("pure black hsl(0, 0%, 0%)", () => {
            expect(getContrastFromHSLA("hsl(0, 0%, 0%)")).toBe("white");
        });

        test("black with alpha hsla(0, 0%, 0%, 1)", () => {
            expect(getContrastFromHSLA("hsla(0, 0%, 0%, 1)")).toBe("white");
        });

        test("dark blue hsl(240, 100%, 25%)", () => {
            expect(getContrastFromHSLA("hsl(240, 100%, 25%)")).toBe("white");
        });

        test("dark red hsl(0, 100%, 25%)", () => {
            expect(getContrastFromHSLA("hsl(0, 100%, 25%)")).toBe("white");
        });

        test("dark green hsl(120, 100%, 15%)", () => {
            expect(getContrastFromHSLA("hsl(120, 100%, 15%)")).toBe("white");
        });

        test("dark purple hsl(270, 80%, 20%)", () => {
            expect(getContrastFromHSLA("hsl(270, 80%, 20%)")).toBe("white");
        });
    });

    describe("handles space-separated HSL syntax", () => {
        test("hsl(210 50% 50%)", () => {
            const result = getContrastFromHSLA("hsl(210 50% 50%)");
            expect(["black", "white"]).toContain(result);
        });

        test("hsl(0 0% 100%)", () => {
            expect(getContrastFromHSLA("hsl(0 0% 100%)")).toBe("black");
        });
    });

    describe("handles decimal values", () => {
        test("hsla(210.5, 50.5%, 50.5%, 0.8)", () => {
            const result = getContrastFromHSLA(
                "hsla(210.5, 50.5%, 50.5%, 0.8)",
            );
            expect(["black", "white"]).toContain(result);
        });
    });

    describe("throws on invalid input", () => {
        test("empty string", () => {
            expect(() => getContrastFromHSLA("")).toThrow(
                "Invalid HSLA string format",
            );
        });

        test("random text", () => {
            expect(() => getContrastFromHSLA("not-a-color")).toThrow(
                "Invalid HSLA string format",
            );
        });

        test("only one number", () => {
            expect(() => getContrastFromHSLA("hsl(210)")).toThrow(
                "Invalid HSLA string format",
            );
        });
    });

    describe("mid-brightness boundary cases", () => {
        test("50% gray hsl(0, 0%, 50%) returns white", () => {
            // 50% lightness gray has RGB(128,128,128), brightness = 128
            // brightness > 128 → black, brightness <= 128 → white
            expect(getContrastFromHSLA("hsl(0, 0%, 50%)")).toBe("white");
        });

        test("slightly above mid hsl(0, 0%, 55%) returns black", () => {
            expect(getContrastFromHSLA("hsl(0, 0%, 55%)")).toBe("black");
        });
    });
});
