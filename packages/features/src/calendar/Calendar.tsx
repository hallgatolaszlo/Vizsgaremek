import { CalendarState } from "@repo/hooks";
import { calculateCellBg, generateGrid, Week } from "@repo/utils";
import { useMemo } from "react";
import { Text, XStack, YStack } from "tamagui";
import CalendarCell from "./CalendarCell";

interface CalendarProps {
	calendarState: CalendarState;
}

export function Calendar({ calendarState }: CalendarProps) {
	const {
		selectedYear,
		selectedMonth,
		selectedDate,
		currentDate,
		weekStartsOn,
		setSelectedYear,
		setSelectedMonth,
		setSelectedDate,
		setCurrentDate,
		setWeekStartsOn,
		decYear,
		incYear,
		decMonth,
		incMonth,
	} = calendarState;

	const grid = useMemo(
		() =>
			generateGrid({
				year: selectedYear,
				month: selectedMonth,
				weekStartsOn,
			}),
		[selectedYear, selectedMonth, weekStartsOn]
	);

	return (
		<YStack flex={1} width="100%" gap="$2">
			<XStack gap="$2" width="100%" style={{ textAlign: "center" }}>
				{Week.getWeekdayLabels(weekStartsOn, "long").map((d, i) => (
					<Text width="100%" key={i} flex={1} fontWeight="$2">
						{d}
					</Text>
				))}
			</XStack>
			{grid.map((row, rowIndex) => (
				<XStack gap="$2" flex={1} width="100%" key={rowIndex}>
					{row.map((cell, i) => (
						<CalendarCell
							key={i}
							cell={cell}
							bg={calculateCellBg(
								cell.date,
								cell.inCurrentMonth,
								selectedDate,
								currentDate,
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
