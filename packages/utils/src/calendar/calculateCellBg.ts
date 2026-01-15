import { CalendarViewType } from "@repo/types";

export function calculateCellBg(
	date: Date,
	inCurrentMonth: boolean,
	selectedDate: Date,
	currentDate: Date,
	viewType: CalendarViewType,
	isSidebar: boolean = false,
	notInCurrentMonthBg: string = "$color3",
	currentDayBg: string = "$color6",
	defaultBg: string = "$color4",
	selectedDayBg: string = "$accent6"
) {
	// Inactive days background
	if (!inCurrentMonth && viewType === "month") {
		return notInCurrentMonthBg;
	}
	// Selected day background for sidebar
	if (isSidebar && date.toDateString() === selectedDate.toDateString()) {
		return selectedDayBg;
	}
	// Selected day background for main calendar
	if (!isSidebar && date.getDate() === selectedDate.getDate()) {
		return selectedDayBg;
	}
	// Current day background
	if (date.toDateString() === currentDate.toDateString()) {
		return currentDayBg;
	}
	// Default background
	return defaultBg;
}
