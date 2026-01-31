export class Month {
	static getMonthLabel(
		locale: Intl.LocalesArgument,
		monthIndex: number,
		format: Intl.DateTimeFormatOptions["month"],
	): string {
		return new Date(2025, monthIndex).toLocaleString(locale, {
			month: format,
		});
	}

	public static getMonthsLabels: (
		locale: Intl.LocalesArgument,
		format: Intl.DateTimeFormatOptions["month"],
	) => string[] = (locale, format) => {
		return [...Array(12).keys()].map((monthIndex) =>
			Month.getMonthLabel(locale, monthIndex, format),
		);
	};

	public static getMonthLabels: (
		locale: Intl.LocalesArgument,
		monthIndex: number,
		format: Intl.DateTimeFormatOptions["month"],
	) => string = (locale, monthIndex, format) => {
		return Month.getMonthLabel(locale, monthIndex, format);
	};
}
