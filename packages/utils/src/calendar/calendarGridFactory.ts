import { CalendarCellProps, CalendarViewType, WeekStartDay } from "@repo/types";
import { getFirstDayOfMonth, getWeekNumberISO } from "./dateMethods";

type GenerateGridOptions = {
	selectedDate: Date;
	weekStartsOn: WeekStartDay;
	viewType: CalendarViewType;
};

export function generateMonthCells(
	selectedDate: Date,
	weekStartsOn: WeekStartDay,
): CalendarCellProps[] {
	const year = selectedDate.getFullYear();
	const month0 = selectedDate.getMonth();
	const weekStartIndex = weekStartsOn === "sunday" ? 0 : 1;

	const firstDay = getFirstDayOfMonth(new Date(year, month0, 1));
	const leadingDays = (firstDay - weekStartIndex + 7) % 7;
	const startDate = new Date(year, month0, 1 - leadingDays);

	const cells: CalendarCellProps[] = [];
	for (let i = 0; i < 42; i++) {
		const d = new Date(startDate);
		d.setDate(startDate.getDate() + i);

		if (i === 35 && d.getMonth() !== month0) {
			break;
		}

		cells.push({
			date: d,
			inCurrentMonth: d.getMonth() === month0,
		});
	}

	return cells;
}

export function generateMultiweekCells(
	selectedDate: Date,
	weekStartsOn: WeekStartDay,
): CalendarCellProps[] {
	const year = selectedDate.getFullYear();
	const month0 = selectedDate.getMonth();
	const weekStartIndex = weekStartsOn === "sunday" ? 0 : 1;

	const currentDayOfWeek = selectedDate.getDay();
	const leadingDays = (currentDayOfWeek - weekStartIndex + 7) % 7;
	const startDate = new Date(
		year,
		month0,
		selectedDate.getDate() - leadingDays,
	);

	const cells: CalendarCellProps[] = [];
	for (let i = 0; i < 28; i++) {
		const d = new Date(startDate);
		d.setDate(startDate.getDate() + i);

		cells.push({
			date: d,
			inCurrentMonth: d.getMonth() === month0,
		});
	}

	return cells;
}

export function generateWeekCells(
	selectedDate: Date,
	weekStartsOn: WeekStartDay,
): CalendarCellProps[] {
	const year = selectedDate.getFullYear();
	const month0 = selectedDate.getMonth();
	const weekStartIndex = weekStartsOn === "sunday" ? 0 : 1;

	const firstDay = new Date(selectedDate);

	while (firstDay.getDay() !== weekStartIndex) {
		firstDay.setDate(firstDay.getDate() - 1);
	}

	const cells: CalendarCellProps[] = [];
	for (let i = 0; i < 7; i++) {
		const d = new Date(firstDay);
		d.setDate(firstDay.getDate() + i);

		cells.push({
			date: d,
			inCurrentMonth: d.getMonth() === month0,
		});
	}

	return cells;
}

export function generateDayCell(selectedDate: Date): CalendarCellProps {
	return {
		date: selectedDate,
		inCurrentMonth: true,
	};
}

export function generateGrid(
	options: GenerateGridOptions,
): Record<string, CalendarCellProps[]> {
	const { selectedDate, weekStartsOn, viewType } = options;

	let cells: CalendarCellProps[] = [];
	const rows: Record<string, CalendarCellProps[]> = {};

	if (viewType === "month") {
		cells = generateMonthCells(selectedDate, weekStartsOn);
	} else if (viewType === "multiweek") {
		cells = generateMultiweekCells(selectedDate, weekStartsOn);
	} else if (viewType === "week") {
		cells = generateWeekCells(selectedDate, weekStartsOn);
	} else if (viewType === "day") {
		cells = [generateDayCell(selectedDate)];
		rows[getWeekNumberISO(selectedDate).toString().padStart(3, "W0")] =
			cells;
		return rows;
	}

	// Split cells into weeks
	for (let i = 0; i < cells.length; i += 7) {
		const weekCells = cells.slice(i, i + 7);
		// Use Thursday (index 4 for Monday start, index 5 for Sunday start) for ISO week number
		const thursdayIndex = weekStartsOn === "monday" ? 3 : 4;
		const weekNumber = getWeekNumberISO(weekCells[thursdayIndex].date);

		rows[`${weekNumber}`.padStart(3, "W0")] = weekCells;
	}

	return rows;
}
