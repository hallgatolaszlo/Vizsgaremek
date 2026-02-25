import { describe, expect, test } from "@jest/globals";
import {
    generateGrid,
    generateMonthCells,
    generateMultiweekCells,
    generateWeekCells,
    generateDayCell,
} from "./calendarGridFactory";

// ─── generateMonthCells ─────────────────────────────────────────────────────

describe("generateMonthCells", () => {
    test("generates 42 cells for a 6 week month", () => {
        const cells = generateMonthCells(new Date("2026-03-01"), "monday");
        expect(cells.length).toBe(42);
    });

    test("generates 35 cells for a 5 week month", () => {
        const cells = generateMonthCells(new Date("2026-01-01"), "monday");
        expect(cells.length).toBe(35);
    });

    test("first cell is from the previous month or the 1st of the current month", () => {
        const cells = generateMonthCells(new Date("2026-03-15"), "monday");
        const firstCell = cells[0];
        // March 2026 starts on Sunday, so with Monday start the grid begins in February
        expect(
            firstCell.date.getMonth() < 2 || firstCell.date.getDate() === 1,
        ).toBe(true);
    });

    test("all cells have a valid date", () => {
        const cells = generateMonthCells(new Date("2026-06-01"), "monday");
        cells.forEach((cell) => {
            expect(cell.date).toBeInstanceOf(Date);
            expect(isNaN(cell.date.getTime())).toBe(false);
        });
    });

    test("inCurrentMonth is true only for days in the selected month", () => {
        const cells = generateMonthCells(new Date("2026-03-15"), "monday");
        cells.forEach((cell) => {
            if (cell.date.getMonth() === 2) {
                expect(cell.inCurrentMonth).toBe(true);
            } else {
                expect(cell.inCurrentMonth).toBe(false);
            }
        });
    });

    test("cells are in chronological order", () => {
        const cells = generateMonthCells(new Date("2026-05-01"), "monday");
        for (let i = 1; i < cells.length; i++) {
            expect(cells[i].date.getTime()).toBeGreaterThan(
                cells[i - 1].date.getTime(),
            );
        }
    });

    test("weekStartsOn sunday shifts leading days", () => {
        const mondayCells = generateMonthCells(
            new Date("2026-03-01"),
            "monday",
        );
        const sundayCells = generateMonthCells(
            new Date("2026-03-01"),
            "sunday",
        );
        // First cell day-of-week should match the week start
        const mondayFirstDay = mondayCells[0].date.getDay();
        const sundayFirstDay = sundayCells[0].date.getDay();
        expect(mondayFirstDay).toBe(1); // Monday
        expect(sundayFirstDay).toBe(0); // Sunday
    });
});

// ─── generateMultiweekCells ─────────────────────────────────────────────────

describe("generateMultiweekCells", () => {
    test("always generates exactly 28 cells (4 weeks)", () => {
        const cells = generateMultiweekCells(new Date("2026-03-23"), "monday");
        expect(cells.length).toBe(28);
    });

    test("first cell starts on the correct weekday", () => {
        const cells = generateMultiweekCells(new Date("2026-03-23"), "monday");
        expect(cells[0].date.getDay()).toBe(1); // Monday
    });

    test("first cell starts on Sunday when weekStartsOn is sunday", () => {
        const cells = generateMultiweekCells(new Date("2026-03-23"), "sunday");
        expect(cells[0].date.getDay()).toBe(0); // Sunday
    });

    test("cells are in chronological order", () => {
        const cells = generateMultiweekCells(new Date("2026-06-15"), "monday");
        for (let i = 1; i < cells.length; i++) {
            expect(cells[i].date.getTime()).toBeGreaterThan(
                cells[i - 1].date.getTime(),
            );
        }
    });
});

// ─── generateWeekCells ──────────────────────────────────────────────────────

describe("generateWeekCells", () => {
    test("always generates exactly 7 cells", () => {
        const cells = generateWeekCells(new Date("2026-03-11"), "monday");
        expect(cells.length).toBe(7);
    });

    test("first cell is a Monday when weekStartsOn is monday", () => {
        const cells = generateWeekCells(new Date("2026-03-11"), "monday");
        expect(cells[0].date.getDay()).toBe(1);
    });

    test("first cell is a Sunday when weekStartsOn is sunday", () => {
        const cells = generateWeekCells(new Date("2026-03-11"), "sunday");
        expect(cells[0].date.getDay()).toBe(0);
    });

    test("last cell is the next day before week start", () => {
        const cells = generateWeekCells(new Date("2026-03-11"), "monday");
        expect(cells[6].date.getDay()).toBe(0); // Sunday
    });

    test("cells span exactly 7 consecutive days", () => {
        const cells = generateWeekCells(new Date("2026-03-11"), "monday");
        for (let i = 1; i < cells.length; i++) {
            const diff = cells[i].date.getTime() - cells[i - 1].date.getTime();
            expect(diff).toBe(86400000); // 1 day in ms
        }
    });
});

// ─── generateDayCell ────────────────────────────────────────────────────────

describe("generateDayCell", () => {
    test("returns a single cell for the given date", () => {
        const date = new Date("2026-05-20");
        const cell = generateDayCell(date);
        expect(cell.date).toBe(date);
        expect(cell.inCurrentMonth).toBe(true);
    });
});

// ─── generateGrid ───────────────────────────────────────────────────────────

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

    test("generates 4 rows for multiweek view", () => {
        const rows = generateGrid({
            selectedDate: new Date("2026-03-23"),
            weekStartsOn: "monday",
            viewType: "multiweek",
        });
        expect(Object.keys(rows).length).toBe(4);
    });

    test("generates 1 row for week view", () => {
        const rows = generateGrid({
            selectedDate: new Date("2026-03-11"),
            weekStartsOn: "monday",
            viewType: "week",
        });
        expect(Object.keys(rows).length).toBe(1);
    });

    test("week row contains exactly 7 cells", () => {
        const rows = generateGrid({
            selectedDate: new Date("2026-03-11"),
            weekStartsOn: "monday",
            viewType: "week",
        });
        const weekCells = Object.values(rows)[0];
        expect(weekCells.length).toBe(7);
    });

    test("generates 1 row for day view", () => {
        const rows = generateGrid({
            selectedDate: new Date("2026-03-11"),
            weekStartsOn: "monday",
            viewType: "day",
        });
        expect(Object.keys(rows).length).toBe(1);
    });

    test("day row contains exactly 1 cell", () => {
        const rows = generateGrid({
            selectedDate: new Date("2026-03-11"),
            weekStartsOn: "monday",
            viewType: "day",
        });
        const dayCells = Object.values(rows)[0];
        expect(dayCells.length).toBe(1);
    });

    test("row keys are padded ISO week numbers (W0X format)", () => {
        const rows = generateGrid({
            selectedDate: new Date("2026-01-05"),
            weekStartsOn: "monday",
            viewType: "month",
        });
        Object.keys(rows).forEach((key) => {
            expect(key).toMatch(/^W?\d{2}$/);
        });
    });

    test("each month row has exactly 7 cells", () => {
        const rows = generateGrid({
            selectedDate: new Date("2026-06-01"),
            weekStartsOn: "monday",
            viewType: "month",
        });
        Object.values(rows).forEach((weekCells) => {
            expect(weekCells.length).toBe(7);
        });
    });
});
