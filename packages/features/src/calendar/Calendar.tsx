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

	// Determine styling based on platform amd view type
	const weekDayLabels = isNative()
		? Week.getWeekdayLabels(weekStartsOn, "normal")
		: Week.getWeekdayLabels(weekStartsOn, "long");
	const dayLabel = Week.getWeekdayLabels("sunday", "long")[
		selectedDate.getDay()
	];
	const gap = isNative() ? "$1" : "$2";

	return (
		<YStack flex={1} width="100%" gap={gap}>
			{/* Weekday Labels Header */}
			<XStack gap={gap} width="100%">
				{/* Hidden week number header for alignment */}
				<Text style={{ visibility: "hidden" }}>W00</Text>
				{viewType === "day" ? (
					<Text
						width="100%"
						fontWeight="$2"
						style={{ textAlign: "center" }}
					>
						{dayLabel}
					</Text>
				) : (
					weekDayLabels.map((d, i) => (
						<Text
							width="100%"
							key={i}
							flex={1}
							fontWeight="$2"
							style={{ textAlign: "center" }}
						>
							{d}
						</Text>
					))
				)}
			</XStack>
			{/* Calendar Grid */}
			{Object.entries(grid).map(([weekNumber, row], rowIndex) => (
				<XStack gap={gap} flex={1} width="100%" key={rowIndex}>
					<Text fontWeight="$2">{weekNumber}</Text>
					{row.map((cell, i) => (
						<CalendarCell key={i} cell={cell} />
					))}
				</XStack>
			))}
		</YStack>
	);
}
