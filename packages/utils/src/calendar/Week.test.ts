import { describe, expect, test } from "@jest/globals";
import { Week } from "./Week";

describe("Week.getWeekLabel", () => {
    test("returns 'Sunday' for weekdayIndex 0 (long format, en-US)", () => {
        expect(Week.getWeekLabel("en-US", 0, "long")).toBe("Sunday");
    });

    test("returns 'Saturday' for weekdayIndex 6 (long format, en-US)", () => {
        expect(Week.getWeekLabel("en-US", 6, "long")).toBe("Saturday");
    });

    test("returns 'Sun' for weekdayIndex 0 (short format, en-US)", () => {
        expect(Week.getWeekLabel("en-US", 0, "short")).toBe("Sun");
    });

    test("returns 'Wed' for weekdayIndex 3 (short format, en-US)", () => {
        expect(Week.getWeekLabel("en-US", 3, "short")).toBe("Wed");
    });

    test("returns 'S' for weekdayIndex 0 (narrow format, en-US)", () => {
        expect(Week.getWeekLabel("en-US", 0, "narrow")).toBe("S");
    });
});

describe("Week.getWeekdayLabels", () => {
    test("returns 7 labels", () => {
        const labels = Week.getWeekdayLabels("en-US", "short", "sunday");
        expect(labels).toHaveLength(7);
    });

    test("starts with Sun when weekStartDay is sunday", () => {
        const labels = Week.getWeekdayLabels("en-US", "short", "sunday");
        expect(labels[0]).toBe("Sun");
        expect(labels[6]).toBe("Sat");
    });

    test("starts with Mon when weekStartDay is monday", () => {
        const labels = Week.getWeekdayLabels("en-US", "short", "monday");
        expect(labels[0]).toBe("Mon");
        expect(labels[6]).toBe("Sun");
    });

    test("monday start has correct full order (long format)", () => {
        const labels = Week.getWeekdayLabels("en-US", "long", "monday");
        expect(labels).toEqual([
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
        ]);
    });

    test("sunday start has correct full order (long format)", () => {
        const labels = Week.getWeekdayLabels("en-US", "long", "sunday");
        expect(labels).toEqual([
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
        ]);
    });

    test("all labels are non-empty strings", () => {
        const labels = Week.getWeekdayLabels("en-US", "long", "monday");
        labels.forEach((label) => {
            expect(typeof label).toBe("string");
            expect(label.length).toBeGreaterThan(0);
        });
    });
});

describe("Week.getWeekdayLabel (alias)", () => {
    test("returns same result as getWeekLabel", () => {
        expect(Week.getWeekdayLabel("en-US", 2, "long")).toBe(
            Week.getWeekLabel("en-US", 2, "long"),
        );
    });
});
