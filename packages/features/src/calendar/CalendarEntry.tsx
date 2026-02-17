import { useProfileStore } from "@repo/hooks";
import { components } from "@repo/types";
import { getContrastFromHSLA } from "@repo/utils";
import { Card, Text, Tooltip, useTheme } from "tamagui";

type GetCalendarEntryDTO = components["schemas"]["GetCalendarEntryDTO"];

interface CalendarEntryProps {
	entry: GetCalendarEntryDTO;
}

export function CalendarEntry({ entry }: CalendarEntryProps) {
	const currentTheme = useTheme();
	const theme = useTheme({ name: "calendarColors" });
	const backgroundColor = theme[`color${entry.color}`]?.val;
	const textColor = getContrastFromHSLA(backgroundColor);
	const { locale } = useProfileStore();

	function entryText() {
		return entry.isAllDay
			? entry.name
			: `${entry.name} (${new Date(entry.startDate!).toLocaleTimeString(
					locale,
					{
						hour: "numeric",
						minute: "2-digit",
					},
				)} - ${new Date(entry.endDate!).toLocaleTimeString(locale, {
					hour: "numeric",
					minute: "2-digit",
				})})`;
	}

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
			<Tooltip>
				<Tooltip.Trigger>
					<Text
						textOverflow="ellipsis"
						whiteSpace="nowrap"
						overflow="hidden"
						color={textColor}
					>
						{entryText()}
					</Text>
				</Tooltip.Trigger>
				<Tooltip.Content
					style={{ backgroundColor: currentTheme.color2.val }}
				>
					<Text style={{ color: currentTheme.color12.val }}>
						{entryText()}
					</Text>
				</Tooltip.Content>
			</Tooltip>
		</Card>
	);
}
