import { components } from "@repo/types";
import { getContrastFromHSLA } from "@repo/utils";
import { Card, Text, useTheme } from "tamagui";

type GetCalendarEntryDTO = components["schemas"]["GetCalendarEntryDTO"];

interface CalendarEntryProps {
	entry: GetCalendarEntryDTO;
}

export function CalendarEntry({ entry }: CalendarEntryProps) {
	const theme = useTheme({ name: "calendarColors" });
	const backgroundColor = theme[`color${entry.color}`]?.val;
	const textColor = getContrastFromHSLA(backgroundColor);

	return (
		<Card
			p={"$1"}
			pl={"$3"}
			m={"$1"}
			enterStyle={{ y: -10, opacity: 0 }}
			exitStyle={{ y: -10, opacity: 0 }}
			animation={"quickest"}
			style={{ backgroundColor }}
		>
			<Text
				textOverflow="ellipsis"
				whiteSpace="nowrap"
				overflow="hidden"
				color={textColor}
			>
				{entry.name}
			</Text>
		</Card>
	);
}
