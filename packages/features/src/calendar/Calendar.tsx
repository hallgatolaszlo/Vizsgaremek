import { CalendarState } from "@repo/hooks";
import { CalendarViewType } from "@repo/types";
import { calculateCellBg, generateGrid, isNative, Week } from "@repo/utils";
import { useMemo } from "react";
import { Text, XStack, YStack } from "tamagui";
import CalendarCell from "./CalendarCell";

interface CalendarProps {
	calendarState: CalendarState;
	viewType?: CalendarViewType;
}

export function Calendar({ calendarState, viewType = "month" }: CalendarProps) {
	// Get global state and actions from the calendar store
	const {
		selectedDate,
		currentDate,
		weekStartsOn,
		setSelectedDate,
		setWeekStartsOn,
		decYear,
		incYear,
		decMonth,
		incMonth,
	} = calendarState;

	// Memoized grid generation based on selected date, week start day, and view type
	const grid = useMemo(
		() =>
			generateGrid({
				selectedDate: selectedDate,
				weekStartsOn,
				viewType: viewType,
			}),
		[selectedDate, weekStartsOn, viewType]
	);

	// Determine styling based on platform
	const weekDayLabels = isNative()
		? Week.getWeekdayLabels(weekStartsOn, "normal")
		: Week.getWeekdayLabels(weekStartsOn, "long");
	const gap = isNative() ? "$1" : "$2";

	return (
		<YStack flex={1} width="100%" gap={gap}>
			{/* Weekday Labels Header */}
			<XStack gap={gap} width="100%">
				{/* Hidden week number header for alignment */}
				<Text style={{ visibility: "hidden" }}>W00</Text>
				{weekDayLabels.map((d, i) => (
					<Text
						width="100%"
						key={i}
						flex={1}
						fontWeight="$2"
						style={{ textAlign: "center" }}
					>
						{d}
					</Text>
				))}
			</XStack>
			{/* Calendar Grid */}
			{Object.entries(grid).map(([weekNumber, row], rowIndex) => (
				<XStack gap={gap} flex={1} width="100%" key={rowIndex}>
					<Text fontWeight="$2">{weekNumber}</Text>
					{row.map((cell, i) => (
						<CalendarCell
							key={i}
							cell={cell}
							bg={calculateCellBg(
								cell.date,
								cell.inCurrentMonth,
								selectedDate,
								currentDate,
								viewType,
								false,
								"$color2",
								"$color4",
								"$color3",
								"$accent5"
							)}
						/>
					))}
				</XStack>
			))}
		</YStack>
	);
}
