export function calculateCellBg(
	date: Date,
	inCurrentMonth: boolean,
	selectedDate: Date | null,
	currentDate: Date,
	notInCurrentMonthBg: string = "$color3",
	currentDayBg: string = "$color6",
	defaultBg: string = "$color4",
	selectedDayBg: string = "$accent6"
) {
	if (!inCurrentMonth) {
		return notInCurrentMonthBg;
	}
	if (date.toDateString() === currentDate.toDateString()) {
		return currentDayBg;
	}
	if (date.toDateString() === selectedDate?.toDateString()) {
		return selectedDayBg;
	}
	return defaultBg;
}
