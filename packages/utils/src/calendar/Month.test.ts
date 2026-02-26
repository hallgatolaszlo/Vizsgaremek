import { describe, expect, test } from "@jest/globals";
import { Month } from "./Month";

describe("Month.getMonthLabel", () => {
    test("returns 'January' for monthIndex 0 (long format, en-US)", () => {
        expect(Month.getMonthLabel("en-US", 0, "long")).toBe("January");
    });

    test("returns 'December' for monthIndex 11 (long format, en-US)", () => {
        expect(Month.getMonthLabel("en-US", 11, "long")).toBe("December");
    });

    test("returns 'Jan' for monthIndex 0 (short format, en-US)", () => {
        expect(Month.getMonthLabel("en-US", 0, "short")).toBe("Jan");
    });

    test("returns 'Jun' for monthIndex 5 (short format, en-US)", () => {
        expect(Month.getMonthLabel("en-US", 5, "short")).toBe("Jun");
    });

    test("returns narrow 'J' for monthIndex 0 (narrow format, en-US)", () => {
        expect(Month.getMonthLabel("en-US", 0, "narrow")).toBe("J");
    });

    test("returns '2-digit' format for monthIndex 0 (en-US)", () => {
        expect(Month.getMonthLabel("en-US", 0, "2-digit")).toBe("01");
    });

    test("returns numeric format for monthIndex 11 (en-US)", () => {
        expect(Month.getMonthLabel("en-US", 11, "numeric")).toBe("12");
    });
});

describe("Month.getMonthsLabels", () => {
    test("returns 12 labels", () => {
        const labels = Month.getMonthsLabels("en-US", "long");
        expect(labels).toHaveLength(12);
    });

    test("first label is January, last is December (long, en-US)", () => {
        const labels = Month.getMonthsLabels("en-US", "long");
        expect(labels[0]).toBe("January");
        expect(labels[11]).toBe("December");
    });

    test("returns short labels (en-US)", () => {
        const labels = Month.getMonthsLabels("en-US", "short");
        expect(labels).toEqual([
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ]);
    });

    test("all labels are non-empty strings", () => {
        const labels = Month.getMonthsLabels("en-US", "long");
        labels.forEach((label) => {
            expect(typeof label).toBe("string");
            expect(label.length).toBeGreaterThan(0);
        });
    });
});

describe("Month.getMonthLabels (alias)", () => {
    test("returns same result as getMonthLabel", () => {
        expect(Month.getMonthLabels("en-US", 3, "long")).toBe(
            Month.getMonthLabel("en-US", 3, "long"),
        );
    });
});
