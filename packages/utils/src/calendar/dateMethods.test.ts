import { describe, expect, test } from "@jest/globals";
import { getOrdinalDate, getWeekNumberISO } from "./dateMethods";

describe("getFirstDayOfTheYear returns correct day index (0-6)", () => {
	test("January 1, 2026 is a Thursday (4)", () => {
		expect(new Date("2026-01-01").getDay()).toBe(4);
	});
	test("January 1, 2024 is a Monday (1)", () => {
		expect(new Date("2024-01-01").getDay()).toBe(1);
	});
});

describe("getFirstDayOfMonth returns correct day index (0-6)", () => {
	test("March 1, 2026 is a Sunday (0)", () => {
		expect(new Date("2026-03-01").getDay()).toBe(0);
	});
	test("February 1, 2024 is a Thursday (4)", () => {
		expect(new Date("2024-02-01").getDay()).toBe(4);
	});
});

describe("getOrdinalDate returns correct day of year (1-366)", () => {
	test("first day of the year", () => {
		expect(getOrdinalDate(new Date("2026-01-01"))).toBe(1);
	});
	test("last day of the year", () => {
		expect(getOrdinalDate(new Date("2026-12-31"))).toBe(365);
	});
	test("last day of a leap year", () => {
		expect(getOrdinalDate(new Date("2024-12-31"))).toBe(366);
	});
});

describe("getWeekNumberISO returns correct ISO week number", () => {
	test("first week of the year", () => {
		expect(getWeekNumberISO(new Date("2026-01-01"))).toBe(1);
	});
	test("last week of the year", () => {
		expect(getWeekNumberISO(new Date("2026-12-31"))).toBe(53);
	});
	test("a first week sunday", () => {
		expect(getWeekNumberISO(new Date("2026-01-04"))).toBe(1);
	});
});
