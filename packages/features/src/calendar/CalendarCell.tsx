import { CalendarCellProps } from "@repo/types";
import { isNative, Month } from "@repo/utils";
import { Card, Text } from "tamagui";

interface CalendarCellComponentProps {
	key: any;
	cell: CalendarCellProps;
	bg: string;
}

export default function CalendarCell({ cell, bg }: CalendarCellComponentProps) {
	// Determine header label to show
	const headerLabel = () => {
		// Native: just show the date number
		if (isNative()) {
			return cell.date.getDate();
		}

		// Web: show month abbreviation if first of month...
		if (cell.date.getDate() === 1) {
			return `${
				Month.shortMonths[cell.date.getMonth() + 1]
			} ${cell.date.getDate()}`;
		}

		// ... or last of month
		let date: Date = new Date(cell.date);
		date.setDate(date.getDate() + 1);
		if (date.getMonth() !== cell.date.getMonth()) {
			return `${
				Month.shortMonths[cell.date.getMonth() + 1]
			} ${cell.date.getDate()}`;
		}

		// Otherwise, just show the date number
		return cell.date.getDate();
	};

	return (
		<Card bg={bg as any} flex={1} flexBasis={0} minW={0}>
			<Card.Header>
				<Text style={{ fontWeight: "bold", textAlign: "center" }}>
					{headerLabel()}
				</Text>
			</Card.Header>
		</Card>
	);
}
