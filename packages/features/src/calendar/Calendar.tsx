import { useCalendarStore, useProfileStore } from "@repo/hooks";
import { CalendarCellProps } from "@repo/types";
import { generateGrid, isNative, Week } from "@repo/utils";
import { useMemo } from "react";
import { Card, ScrollView, Text, XStack, YStack } from "tamagui";
import CalendarCell from "./CalendarCell";

interface CalendarProps {
	grid?: Record<string, CalendarCellProps[]> | undefined;
}

export function Calendar({ grid = undefined }: CalendarProps) {
	// Get global state and actions from the calendar store
	const { selectedDate, currentDate, weekStartsOn, viewType } =
		useCalendarStore();

	const { locale } = useProfileStore();

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

	const gap = isNative() ? "$1" : 0;

	const sidebarWidth = isNative() ? "$4" : "$6";

	const WeekdayHeader = useMemo(() => {
		const weekdayLabels = isNative()
			? Week.getWeekdayLabels(locale, "narrow", weekStartsOn)
			: Week.getWeekdayLabels(locale, "long", weekStartsOn);

		return (
			<XStack width="100%">
				<Card
					width={sidebarWidth}
					bg={"$color1"}
					style={{
						borderRadius: 0,
						borderColor: "var(--color5)",
					}}
				/>
				{weekdayLabels.map((d, i) => (
					<Card
						key={i}
						py={"$2"}
						flex={1}
						flexBasis={0}
						bg="$color1"
						style={{
							textAlign: "center",
							borderRadius: 0,
							borderColor: "var(--color5)",
							borderBottomWidth: 0,
							borderLeftWidth: 2,
							borderRightWidth:
								i === weekdayLabels.length - 1 &&
								(viewType === "week" || viewType === "day")
									? 2
									: 0,
						}}
					>
						<Text
							fontWeight="$2"
							style={{
								textAlign: "center",
							}}
						>
							{d}
						</Text>
					</Card>
				))}
			</XStack>
		);
	}, [locale, weekStartsOn, viewType]);

	if (viewType === "month" || viewType === "multiweek") {
		return (
			<YStack
				style={{ border: "2px solid var(--color5)" }}
				flex={1}
				width="100%"
			>
				{WeekdayHeader}
				{/* Calendar Grid */}
				<YStack flex={1} gap={gap} flexBasis={0}>
					{Object.entries(grid).map(([weekNumber, row], rowIndex) => (
						<XStack gap={gap} flex={1} flexBasis={0} key={rowIndex}>
							<Card
								width={sidebarWidth}
								bg={"$color1"}
								style={{
									borderRadius: 0,
									borderColor: "var(--color5)",
									borderTopWidth: 2,
								}}
							>
								<Text
									p={"$2"}
									fontWeight="$2"
									style={{ textAlign: "center" }}
								>
									{weekNumber}
								</Text>
							</Card>
							{row.map((cell, i) => (
								<CalendarCell
									key={i}
									cell={cell}
									style={{
										borderRadius: 0,
										borderLeftWidth: 2,
										borderTopWidth: 2,
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

	if (viewType === "week") {
		return (
			<YStack
				style={{ border: "2px solid var(--color5)" }}
				flex={1}
				width="100%"
				overflow="hidden"
			>
				<XStack style={{ marginRight: "var(--scrollbar-width)" }}>
					{WeekdayHeader}
				</XStack>
				{/* Calendar Grid */}
				{Object.entries(grid).map(([weekNumber, row], rowIndex) => (
					<XStack
						style={{
							marginRight: "var(--scrollbar-width)",
							height: "fit-content",
						}}
						key={rowIndex}
					>
						<Card
							p={"$2"}
							width={sidebarWidth}
							bg={"$color1"}
							style={{
								maxHeight: "fit-content",
								borderRadius: 0,
								borderColor: "var(--color5)",
								borderTopWidth: 2,
								borderBottomWidth: 2,
							}}
						>
							<Text
								fontWeight="$2"
								style={{
									textAlign: "center",
								}}
							>
								{weekNumber}
							</Text>
						</Card>
						{row.map((cell, i) => (
							<CalendarCell
								key={i}
								cell={cell}
								style={{
									maxHeight: "fit-content",
									borderRadius: 0,
									borderLeftWidth: 2,
									borderTopWidth: 2,
									borderBottomWidth:
										Object.keys(grid!).length - 1 ===
										rowIndex
											? 2
											: 0,
									borderRightWidth:
										i === row.length - 1 ? 2 : 0,
									borderColor: "var(--color5)",
								}}
							/>
						))}
					</XStack>
				))}
				<ScrollView flex={1} flexBasis={0}>
					<YStack>
						{[...Array(24).keys()].map((hour) => (
							<XStack
								style={{
									minHeight: "8vh",
									borderColor: "var(--color5)",
								}}
								key={hour}
							>
								<Card
									width={sidebarWidth}
									bg={"$color1"}
									justify={"center"}
									style={{
										transform: [{ translateY: "-50%" }],
									}}
								>
									<Text
										fontWeight="$2"
										color={"$color11"}
										style={{
											userSelect: "none",
											textAlign: "center",
											visibility:
												hour === 0
													? "hidden"
													: "visible",
										}}
									>
										{`${hour}:00`.padStart(5, "0")}
									</Text>
								</Card>
								{[...Array(7).keys()].map((_, i) => (
									<Card
										key={i}
										flex={1}
										flexBasis={0}
										bg="$color1"
										style={{
											borderRadius: 0,
											borderLeftWidth: 2,
											borderTopWidth: hour === 0 ? 0 : 2,
											borderRightWidth: i === 6 ? 2 : 0,
											borderColor: "var(--color5)",
										}}
									></Card>
								))}
							</XStack>
						))}
					</YStack>
				</ScrollView>
			</YStack>
		);
	}

	if (viewType === "day") {
		return (
			<YStack
				style={{ border: "2px solid var(--color5)" }}
				flex={1}
				width="100%"
				overflow="hidden"
			>
				{/* Calendar Grid */}
				{Object.entries(grid).map(([weekNumber, row], rowIndex) => (
					<XStack
						style={{
							marginRight: "var(--scrollbar-width)",
							height: "fit-content",
						}}
						key={rowIndex}
					>
						<Card
							p={"$2"}
							width={sidebarWidth}
							bg={"$color1"}
							style={{
								maxHeight: "fit-content",
								borderRadius: 0,
								borderColor: "var(--color5)",
								borderBottomWidth: 2,
							}}
						>
							<Text
								fontWeight="$2"
								style={{
									textAlign: "center",
								}}
							>
								{weekNumber}
							</Text>
						</Card>
						{row.map((cell, i) => (
							<CalendarCell
								key={i}
								cell={cell}
								style={{
									maxHeight: "fit-content",
									borderRadius: 0,
									borderLeftWidth: 2,
									borderBottomWidth:
										Object.keys(grid!).length - 1 ===
										rowIndex
											? 2
											: 0,
									borderRightWidth:
										i === row.length - 1 ? 2 : 0,
									borderColor: "var(--color5)",
								}}
							/>
						))}
					</XStack>
				))}
				<ScrollView flex={1} flexBasis={0}>
					<YStack>
						{[...Array(24).keys()].map((hour) => (
							<XStack
								style={{
									minHeight: "8vh",
									borderColor: "var(--color5)",
								}}
								key={hour}
							>
								<Card
									width={sidebarWidth}
									bg={"$color1"}
									justify={"center"}
									style={{
										transform: [{ translateY: "-50%" }],
									}}
								>
									<Text
										fontWeight="$2"
										color={"$color11"}
										style={{
											userSelect: "none",
											textAlign: "center",
											visibility:
												hour === 0
													? "hidden"
													: "visible",
										}}
									>
										{`${hour}:00`.padStart(5, "0")}
									</Text>
								</Card>
								{[0].map((_, i) => (
									<Card
										key={i}
										flex={1}
										flexBasis={0}
										bg="$color1"
										style={{
											borderRadius: 0,
											borderLeftWidth: 2,
											borderTopWidth: hour === 0 ? 0 : 2,
											borderRightWidth: 2,
											borderColor: "var(--color5)",
										}}
									></Card>
								))}
							</XStack>
						))}
					</YStack>
				</ScrollView>
			</YStack>
		);
	}
}
