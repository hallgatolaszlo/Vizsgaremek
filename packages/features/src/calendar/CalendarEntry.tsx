import CalendarEntryDetail from "@/src/components/CalendarPage/CalendarEntryDetail";
import CustomDialog from "@/src/components/CalendarPage/CustomDialog";
import { useProfileStore } from "@repo/hooks";
import { components } from "@repo/types";
import { getContrastFromHSLA } from "@repo/utils";
import { useState } from "react";
import { Card, Dialog, Text, useTheme } from "tamagui";

type GetCalendarEntryDTO = components["schemas"]["GetCalendarEntryDTO"];

interface CalendarEntryProps {
	entry: GetCalendarEntryDTO;
	height?: string;
	marginTop?: string;
	isMultiDay?: boolean;
	isStart?: boolean;
	isEnd?: boolean;
	showText?: boolean;
	isRowStart?: boolean;
	isRowEnd?: boolean;
	isGhost?: boolean;
}

export function CalendarEntry({
	entry,
	height,
	marginTop,
	isMultiDay,
	isStart,
	isEnd,
	showText,
	isRowStart,
	isRowEnd,
	isGhost = false,
}: CalendarEntryProps) {
	const calendarTheme = useTheme({ name: "calendarColors" });
	const backgroundColor = isGhost
		? "transparent"
		: calendarTheme[`color${entry.color}`]?.val;
	const textColor = isGhost
		? undefined
		: getContrastFromHSLA(backgroundColor);
	const { locale, hour12 } = useProfileStore();
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	function entryText() {
		// For multi-day entries in month/multiweek, show only the name
		if (isMultiDay) return entry.name;
		return entry.isAllDay
			? entry.name
			: `${entry.name} (${new Date(entry.startDate!).toLocaleTimeString(
					locale,
					{
						hour: "numeric",
						minute: "2-digit",
						hour12,
					},
				)} - ${new Date(entry.endDate!).toLocaleTimeString(locale, {
					hour: "numeric",
					minute: "2-digit",
					hour12,
				})})`;
	}

	// Ghost entries are placeholders used to reserve vertical slots for
	// multi-day spanning events. They shouldn't open dialogs or show text.
	if (isGhost) {
		return (
			<Card
				p={"$1"}
				pl={"$2"}
				m={"0"}
				mb={"1px"}
				animation={"quickest"}
				style={{
					backgroundColor,
					height: height,
					marginTop: "$1",
					minHeight: 20,
					width: "100%",
					borderRadius: isMultiDay
						? isStart && isEnd
							? 8
							: isStart || isRowStart
								? "8px 0 0 8px"
								: isEnd || isRowEnd
									? "0 8px 8px 0"
									: 0
						: undefined,
					overflow: "hidden",
				}}
				className="entryCard"
			/>
		);
	}

	return (
		<CustomDialog
			isDialogOpen={isDialogOpen}
			setIsDialogOpen={setIsDialogOpen}
			content={
				<CalendarEntryDetail
					entry={entry}
					onClose={() => setIsDialogOpen(false)}
				/>
			}
			onPointerDownOutside={(e) => e.preventDefault()}
		>
			<Dialog.Trigger asChild>
				<Card
					p={"$1"}
					pl={"$2"}
					m={"0"}
					mb={"1px"}
					enterStyle={{ y: -10, opacity: 0 }}
					exitStyle={{ y: -10, opacity: 0 }}
					animation={"quickest"}
					style={{
						backgroundColor,
						height: height,
						marginTop: "$1",
						minHeight: 20,
						width: "100%",
						borderRadius: isMultiDay
							? isStart && isEnd
								? 8
								: isStart || isRowStart
									? "8px 0 0 8px"
									: isEnd || isRowEnd
										? "0 8px 8px 0"
										: 0
							: undefined,
						overflow: "hidden",
						display: "flex",
						justifyContent: "center",
					}}
					className="entryCard"
					tabIndex={0}
					onPress={(e) => e.stopPropagation()}
				>
					<Text
						textOverflow="ellipsis"
						whiteSpace="nowrap"
						overflow="hidden"
						color={textColor}
						fontSize={"$3"}
					>
						{isMultiDay
							? showText
								? entryText()
								: null
							: entryText()}
					</Text>
				</Card>
			</Dialog.Trigger>
		</CustomDialog>
	);
}
