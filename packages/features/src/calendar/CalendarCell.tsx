import { useCalendarStore } from "@repo/hooks";
import { CalendarCellProps } from "@repo/types";
import { isNative, Month } from "@repo/utils";
import { Card, CardProps, Text } from "tamagui";

interface CalendarCellComponentProps extends CardProps {
	cell: CalendarCellProps;
}

export default function CalendarCell(props: CalendarCellComponentProps) {
	const { selectedDate, viewType, setSelectedDate, currentDate } =
		useCalendarStore();

	const { cell } = props;

	// Determine header label to show
	const headerLabel = () => {
		// Native: just show the date number
		if (isNative()) {
			return cell.date.getDate();
		}

		// Web: show month abbreviation if first of month...
		if (cell.date.getDate() === 1) {
			return `${
				Month.shortMonths[cell.date.getMonth()]
			} ${cell.date.getDate()}`;
		}

		// ... or last of month
		let date: Date = new Date(cell.date);
		date.setDate(date.getDate() + 1);
		if (date.getMonth() !== cell.date.getMonth()) {
			return `${
				Month.shortMonths[cell.date.getMonth()]
			} ${cell.date.getDate()}`;
		}

		// Otherwise, just show the date number
		return cell.date.getDate();
	};

	function decideStyling(cell: CalendarCellProps): CardProps {
		// Day view returns default styling
		if (viewType === "day") {
			return { bg: "$color3" };
		}
		// Selected date styling
		if (cell.date.toDateString() === selectedDate.toDateString()) {
			return {
				bg: "$accent3",
				outlineWidth: 2,
				outlineColor: "$accent9",
				outlineStyle: "solid",
			};
		}
		// Current date styling
		if (cell.date.toDateString() === currentDate.toDateString()) {
			return { bg: "$color4" };
		}
		// Out-of-month styling for month view
		if (viewType === "month" && !cell.inCurrentMonth) {
			return { bg: "$color2" };
		}
		// Default styling
		return { bg: "$color3" };
	}

	return (
		<Card
			{...decideStyling(cell)}
			{...props}
			flex={1}
			flexBasis={0}
			minW={0}
			onPress={() => setSelectedDate(new Date(cell.date))}
		>
			<Card.Header>
				<Text style={{ fontWeight: "bold", textAlign: "center" }}>
					{headerLabel()}
				</Text>
			</Card.Header>
		</Card>
	);
}
