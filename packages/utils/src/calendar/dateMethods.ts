// Get the first day of the year (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
export function getFirstDayOfTheYear(date: Date): number {
	return new Date(date.getFullYear(), 0, 1).getDay();
}

// Get the first day of the month (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
export function getFirstDayOfMonth(date: Date): number {
	return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
}

// Get the day number within the year (1 to 365 or 366)
export function getOrdinalDate(date: Date): number {
	const start = new Date(date.getFullYear(), 0, 1);
	const diff = date.getTime() - start.getTime();
	const oneDay = 1000 * 60 * 60 * 24;
	return Math.floor(diff / oneDay) + 1;
}

// Calculate ISO week number for a given date
// ISO week 1 is the week containing January 4th (first week with a Thursday)
export function getWeekNumberISO(date: Date): number {
	// Create a copy to avoid mutating the original
	const target = new Date(date.valueOf());

	// Set to nearest Thursday: current date + 4 - current day number (make Sunday = 7)
	const dayOfWeek = target.getDay() || 7;
	target.setDate(target.getDate() + 4 - dayOfWeek);

	// Get first day of that year
	const yearStart = new Date(target.getFullYear(), 0, 1);

	// Calculate full weeks between yearStart and target
	const weekNumber = Math.ceil(
		((target.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
	);

	return weekNumber;
}
