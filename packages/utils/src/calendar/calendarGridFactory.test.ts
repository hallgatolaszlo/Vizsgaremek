import { describe, expect, test } from "@jest/globals";
import { generateGrid, generateMonthCells } from "./calendarGridFactory";

describe("generateMonthCells", () => {
	test("generates 42 cells for a 6 week month", () => {
		generateMonthCells(new Date("2026-03-01"), "monday");
		const cells = generateMonthCells(new Date("2026-03-01"), "monday");
		expect(cells.length).toBe(42);
	});
	test("generates 35 cells for a 5 week month", () => {
		const cells = generateMonthCells(new Date("2026-01-01"), "monday");
		expect(cells.length).toBe(35);
	});
});

describe("generateGrid", () => {
	test("generates 6 rows for a 6 week month", () => {
		const rows = generateGrid({
			selectedDate: new Date("2026-03-01"),
			weekStartsOn: "monday",
			viewType: "month",
		});
		expect(Object.keys(rows).length).toBe(6);
	});
	test("generates 5 rows for a 5 week month", () => {
		const rows = generateGrid({
			selectedDate: new Date("2026-01-01"),
			weekStartsOn: "monday",
			viewType: "month",
		});
		expect(Object.keys(rows).length).toBe(5);
	});
	test("generate 4 rows for multiweek view", () => {
		const rows = generateGrid({
			selectedDate: new Date("2026-03-23"),
			weekStartsOn: "monday",
			viewType: "multiweek",
		});
		expect(Object.keys(rows).length).toBe(4);
	});
});
