import { useCalendarStore } from "@repo/hooks";
import { CalendarCellProps } from "@repo/types";
import { generateGrid, isNative, Week } from "@repo/utils";
import { useMemo } from "react";
import { Text, XStack, YStack } from "tamagui";
import CalendarCell from "./CalendarCell";

interface CalendarProps {
	grid?: Record<string, CalendarCellProps[]> | undefined;
}

export function Calendar({ grid = undefined }: CalendarProps) {
	// Get global state and actions from the calendar store
	const { selectedDate, currentDate, weekStartsOn, viewType } =
		useCalendarStore();

	// Memoized grid generation based on selected date, week start day, and view type
	if (!grid) {
		grid = useMemo(
			() =>
				generateGrid({
					selectedDate: selectedDate,
					weekStartsOn,
					viewType: viewType,
				}),
			[selectedDate, weekStartsOn, viewType],
		);
	}

	// Determine styling based on platform
	const weekDayLabels = isNative()
		? Week.getWeekdayLabels(weekStartsOn, "normal")
		: Week.getWeekdayLabels(weekStartsOn, "long");

	const gap = isNative() ? "$1" : 0;

	if (viewType === "month" || viewType === "multiweek") {
		return (
			<YStack flex={1} width="100%">
				{/* Weekday Labels Header */}
				<XStack width="100%">
					{/* Hidden week number header for alignment */}
					{weekDayLabels.map((d, i) => (
						<Text
							key={i}
							py={"$2"}
							flex={1}
							flexBasis={0}
							fontWeight="$2"
							style={{
								textAlign: "center",
								border: "2px solid var(--color5)",
								borderBottomWidth: 0,
								borderLeftWidth: 2,
								borderRightWidth:
									i === weekDayLabels.length - 1 ? 2 : 0,
							}}
						>
							{d}
						</Text>
					))}
				</XStack>
				{/* Calendar Grid */}
				<YStack flex={1} gap={gap} flexBasis={0}>
					{Object.entries(grid).map(([weekNumber, row], rowIndex) => (
						<XStack gap={gap} flex={1} flexBasis={0} key={rowIndex}>
							{row.map((cell, i) => (
								<CalendarCell
									key={i}
									cell={cell}
									weekNumber={i == 0 ? weekNumber : ""}
									style={{
										borderRadius: 0,
										borderLeftWidth: 2,
										borderTopWidth: 2,
										borderRightWidth:
											i === row.length - 1 ? 2 : 0,
										borderBottomWidth:
											rowIndex ===
											Object.keys(grid).length - 1
												? 2
												: 0,
										borderColor: "var(--color5)",
									}}
								/>
							))}
						</XStack>
					))}
				</YStack>
			</YStack>
		);
	}

	return (
		<YStack flex={1} width="100%">
			{/* Weekday Labels Header */}
			<XStack width="100%">
				{/* Hidden week number header for alignment */}
				{viewType === "week" &&
					weekDayLabels.map((d, i) => (
						<Text
							key={i}
							py={"$2"}
							flex={1}
							flexBasis={0}
							fontWeight="$2"
							style={{
								textAlign: "center",
								border: "2px solid var(--color5)",
								borderBottomWidth: 0,
								borderLeftWidth: 2,
								borderRightWidth:
									i === weekDayLabels.length - 1 ? 2 : 0,
							}}
						>
							{d}
						</Text>
					))}
			</XStack>
			{/* Calendar Grid */}
			{Object.entries(grid).map(([weekNumber, row], rowIndex) => (
				<XStack flex={1} flexBasis={0} key={rowIndex}>
					{row.map((cell, i) => (
						<CalendarCell
							key={i}
							cell={cell}
							style={{
								maxHeight: "fit-content",
								borderRadius: 0,
								borderLeftWidth: 2,
								borderTopWidth: 2,
								borderRightWidth: i === row.length - 1 ? 2 : 0,
								borderBottomWidth:
									rowIndex === Object.keys(grid).length - 1
										? 2
										: 0,
								borderColor: "var(--color5)",
							}}
						/>
					))}
				</XStack>
			))}
		</YStack>
	);
}
