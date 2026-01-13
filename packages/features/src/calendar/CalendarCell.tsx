import { CalendarCellProps, MonthIndex } from "@repo/types";
import { Month } from "@repo/utils";
import { Card, Text } from "tamagui";

interface CalendarCellComponentProps {
	key: any;
	cell: CalendarCellProps;
	bg: string;
}

export default function CalendarCell({ cell, bg }: CalendarCellComponentProps) {
	return (
		<Card bg={bg as any} flex={1} flexBasis={0} minW={0}>
			<Card.Header>
				<Text style={{ fontWeight: "bold", textAlign: "center" }}>
					{cell.date.getDate() === 1
						? `${
								Month.shortMonths[
									(cell.date.getMonth() + 1) as MonthIndex
								]
						  } ${cell.date.getDate()}`
						: cell.date.getDate()}
				</Text>
			</Card.Header>
		</Card>
	);
}
