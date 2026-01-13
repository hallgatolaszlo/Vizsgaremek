import { CalendarCellProps, WeekStartDay } from "@repo/types";
import { Month } from "./Month";

type GenerateDatesOptions = {
	year: number;
	month: Month;
	weekStartsOn: WeekStartDay;
};

export function generateCalendarCells(
	options: GenerateDatesOptions
): CalendarCellProps[] {
	const { year, weekStartsOn } = options;
	const month0 = options.month.month0Index;

	const firstOfMonth = new Date(year, month0, 1);
	const firstDay = firstOfMonth.getDay(); // 0..6 (Sun..Sat)

	const weekStartIndex = weekStartsOn === "sunday" ? 0 : 1;
	const leadingDays = (firstDay - weekStartIndex + 7) % 7;

	const startDate = new Date(year, month0, 1 - leadingDays);

	const cells: CalendarCellProps[] = [];
	for (let i = 0; i < 42; i++) {
		const d = new Date(startDate);
		d.setDate(startDate.getDate() + i);

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
): CalendarCellProps[][] {
	const cells = generateCalendarCells(options);
	const rows: CalendarCellProps[][] = [];
	for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
	return rows;
}
