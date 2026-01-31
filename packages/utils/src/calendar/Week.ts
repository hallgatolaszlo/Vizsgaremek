import { WeekStartDay } from "@repo/types";

export class Week {
	static getWeekLabel(
		locale: Intl.LocalesArgument,
		weekdayIndex: number,
		format: Intl.DateTimeFormatOptions["weekday"],
	): string {
		return new Date(2023, 9, weekdayIndex + 1).toLocaleString(locale, {
			weekday: format,
		});
	}

	static getWeekdayLabels = (
		locale: Intl.LocalesArgument,
		format: Intl.DateTimeFormatOptions["weekday"],
		weekStartDay: WeekStartDay,
	) => {
		const week = [...Array(7).keys()].map((weekdayIndex) =>
			Week.getWeekLabel(locale, weekdayIndex, format),
		);

		// Adjust the week array based on the specified week start day
		if (weekStartDay === "sunday") {
			return week;
		} else {
			return [...week.slice(1, week.length), week[0]];
		}
	};

	static getWeekdayLabel = (
		locale: Intl.LocalesArgument,
		weekdayIndex: number,
		format: Intl.DateTimeFormatOptions["weekday"],
	): string => {
		return Week.getWeekLabel(locale, weekdayIndex, format);
	};
}
