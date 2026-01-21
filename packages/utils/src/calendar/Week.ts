import {
	WeekDayLabel,
	WeekDayLabelLong,
	WeekDayLabelShort,
	WeekStartDay,
} from "@repo/types";
export class Week {
	static WEEKDAY_LABELS = {
		monday: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
		sunday: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
	} as const satisfies Record<WeekStartDay, readonly WeekDayLabel[]>;

	static SHORT_WEEKDAY_LABELS = {
		monday: ["M", "T", "W", "T", "F", "S", "S"],
		sunday: ["S", "M", "T", "W", "T", "F", "S"],
	} as const satisfies Record<WeekStartDay, readonly WeekDayLabelShort[]>;

	static LONG_WEEKDAY_LABELS = {
		monday: [
			"Monday",
			"Tuesday",
			"Wednesday",
			"Thursday",
			"Friday",
			"Saturday",
			"Sunday",
		],
		sunday: [
			"Sunday",
			"Monday",
			"Tuesday",
			"Wednesday",
			"Thursday",
			"Friday",
			"Saturday",
		],
	} as const satisfies Record<WeekStartDay, readonly WeekDayLabelLong[]>;

	static getWeekdayLabels(
		weekStartsOn: WeekStartDay,
		format: "short" | "long" | "normal" = "normal",
	): readonly string[] {
		switch (format) {
			case "short":
				return Week.SHORT_WEEKDAY_LABELS[weekStartsOn];
			case "long":
				return Week.LONG_WEEKDAY_LABELS[weekStartsOn];
			case "normal":
			default:
				return Week.WEEKDAY_LABELS[weekStartsOn];
		}
	}
}
