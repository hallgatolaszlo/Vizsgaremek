import { MonthLabel, MonthLabelShort } from "@repo/types";

export class Month {
	// month0Index is 0-based like JS Date (0 = January, 11 = December)
	public month0Index: number;
	// month1Index is 1-based because we are not idiots (1 = January, 12 = December)
	public month1Index: number;
	// monthLabel is the full month name
	public monthLabel: MonthLabel;
	// monthLabelShort is the short month name
	public monthLabelShort: MonthLabelShort;

	public static months: Record<number, MonthLabel> = {
		1: "January",
		2: "February",
		3: "March",
		4: "April",
		5: "May",
		6: "June",
		7: "July",
		8: "August",
		9: "September",
		10: "October",
		11: "November",
		12: "December",
	};

	public static shortMonths: Record<number, MonthLabelShort> = {
		1: "Jan",
		2: "Feb",
		3: "Mar",
		4: "Apr",
		5: "May",
		6: "Jun",
		7: "Jul",
		8: "Aug",
		9: "Sep",
		10: "Oct",
		11: "Nov",
		12: "Dec",
	};

	constructor(startingIndex: 0 | 1, month: number) {
		if (startingIndex === 0) {
			month += 1;
		}

		if (month < 1 || month > 12) {
			throw new Error("Month must be between 1 and 12");
		}

		const monthIndex = month;

		this.month1Index = monthIndex;
		this.month0Index = monthIndex - 1;
		this.monthLabel = Month.months[monthIndex];
		this.monthLabelShort = Month.shortMonths[monthIndex];
	}
}
