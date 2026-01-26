import { getContrastFromHSLA } from "@repo/utils";
import { Card, Text, useTheme } from "tamagui";

interface CalendarEntryProps {
	name: string;
	colorIndex: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12; // Index to pick color from calendarColors
}

export function CalendarEntry({ name, colorIndex }: CalendarEntryProps) {
	const theme = useTheme({ name: "calendarColors" });
	const backgroundColor = theme[`color${colorIndex}`]?.val || "white";
	const textColor = getContrastFromHSLA(backgroundColor);

	return (
		<Card p={"$1"} pl={"$3"} m={"$1"} style={{ backgroundColor }}>
			<Text
				textOverflow="ellipsis"
				whiteSpace="nowrap"
				overflow="hidden"
				color={textColor}
			>
				{name}
			</Text>
		</Card>
	);
}
