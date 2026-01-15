export type MonthLabel =
	| "January"
	| "February"
	| "March"
	| "April"
	| "May"
	| "June"
	| "July"
	| "August"
	| "September"
	| "October"
	| "November"
	| "December";

export type MonthLabelShort =
	| "Jan"
	| "Feb"
	| "Mar"
	| "Apr"
	| "May"
	| "Jun"
	| "Jul"
	| "Aug"
	| "Sep"
	| "Oct"
	| "Nov"
	| "Dec";

export type WeekDayLabelShort = "S" | "M" | "T" | "W" | "T" | "F";

export type WeekDayLabel =
	| "Sun"
	| "Mon"
	| "Tue"
	| "Wed"
	| "Thu"
	| "Fri"
	| "Sat";

export type WeekDayLabelLong =
	| "Sunday"
	| "Monday"
	| "Tuesday"
	| "Wednesday"
	| "Thursday"
	| "Friday"
	| "Saturday";

export type WeekStartDay = "sunday" | "monday";

export type CalendarCellProps = {
	date: Date;
	inCurrentMonth: boolean;
};

export type CalendarViewType = "month" | "multiweek";
