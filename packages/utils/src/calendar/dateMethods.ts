// Get the first day of the year (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
export function getFirstDayOfTheYear(date: Date): number {
	return new Date(date.getFullYear(), 0, 1).getDay();
}

// Get the day number within the year (1 to 365 or 366)
export function getDayNumber(date: Date): number {
	const start = new Date(date.getFullYear(), 0, 1);
	const diff = date.getTime() - start.getTime();
	const oneDay = 1000 * 60 * 60 * 24;
	return Math.floor(diff / oneDay) + 1;
}

// Calculate ISO week number for a given date
export function getWeekNumberISO(date: Date): number {
	const offsetMap: Record<number, number> = {
		0: -1, // Sunday
		1: 0, // Monday
		2: 1, // Tuesday
		3: 2, // Wednesday
		4: 3, // Thursday
		5: -3, // Friday
		6: -2, // Saturday
	};

	const firstDayOfTheYear = getFirstDayOfTheYear(date);
	const dayOfYear = getDayNumber(date);
	const adjustedDayOfYear = dayOfYear + offsetMap[firstDayOfTheYear];

	const weekNumber = Math.ceil(adjustedDayOfYear / 7);

	return weekNumber;
}
