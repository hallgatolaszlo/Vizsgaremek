import { CalendarCellProps, CalendarViewType, WeekStartDay } from "@repo/types";
import { getDayNumber, getWeekNumberISO } from "./dateMethods";

type GenerateDatesOptions = {
	selectedDate: Date;
	weekStartsOn: WeekStartDay;
	viewType: CalendarViewType;
};

// Generate an array of cells for the calendar grid
export function generateCalendarCells(
	options: GenerateDatesOptions
): CalendarCellProps[] {
	const { selectedDate, weekStartsOn, viewType } = options;

	const year = selectedDate.getFullYear();
	const month0 = selectedDate.getMonth();
	const day = viewType === "month" ? 1 : selectedDate.getDate();

	const firstDay = getDayNumber(new Date(year, month0, day));

	// Calculate leading days based on week start day
	const weekStartIndex = weekStartsOn === "sunday" ? 0 : 1;
	const leadingDays = (firstDay - weekStartIndex + 7) % 7;

	// Start date for the grid
	const startDate = new Date(year, month0, day - leadingDays);

	const cells: CalendarCellProps[] = [];
	for (let i = 0; i < 42; i++) {
		const d = new Date(startDate);
		d.setDate(startDate.getDate() + i);

		// For month view, stop adding cells after the month ends
		if (i === 35 && d.getMonth() !== month0) break;

		cells.push({
			date: d,
			inCurrentMonth: d.getMonth() === month0,
		});
	}

	return cells;
}

export function generateGrid(
	options: GenerateDatesOptions
): Record<string, CalendarCellProps[]> {
	const cells = generateCalendarCells(options);

	const rows: Record<string, CalendarCellProps[]> = {};

	// Determine number of cells to process based on view type
	const numberOfCells = options.viewType === "multiweek" ? 28 : cells.length;

	// Split cells into weeks
	for (let i = 0; i < numberOfCells; i += 7) {
		const weekCells = cells.slice(i, i + 7);
		const weekNumber = getWeekNumberISO(weekCells[6].date);

		rows[`${weekNumber}`.padStart(3, "W0")] = weekCells;
	}

	return rows;
}
