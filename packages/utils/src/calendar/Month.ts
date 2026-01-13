import { MonthIndex, MonthLabel } from "@repo/types";

export class Month {
	public month0Index: MonthIndex;
	public month1Index: MonthIndex;
	public monthLabel: MonthLabel;

	public static months: Record<MonthIndex, MonthLabel> = {
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

	public static shortMonths: Record<MonthIndex, string> = {
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

		const monthIndex = month as MonthIndex;

		this.month1Index = monthIndex;
		this.month0Index = (monthIndex - 1) as MonthIndex;
		this.monthLabel = Month.months[monthIndex];
	}
}
