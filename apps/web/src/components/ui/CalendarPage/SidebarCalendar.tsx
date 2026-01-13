"use client";

import { StyledButton } from "@repo/ui";
import { Check } from "@tamagui/lucide-icons";
import { useCallback, useMemo, useState } from "react";
import { Select, Separator, Text, View, XGroup, XStack, YStack } from "tamagui";

type MonthIndex = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
type WeekStartDay = "sunday" | "monday";

type CalendarCell = {
	date: Date;
	inCurrentMonth: boolean;
};

type GenerateDatesOptions = {
	year: number;
	month: MonthIndex;
	weekStartsOn: WeekStartDay;
};

const WEEKDAY_LABELS = {
	monday: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
	sunday: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
} as const satisfies Record<WeekStartDay, readonly string[]>;

function generateCalendarCells(options: GenerateDatesOptions): CalendarCell[] {
	const { year, weekStartsOn } = options;
	const month0 = options.month - 1; // JS months are 0-based

	const firstOfMonth = new Date(year, month0, 1);
	const firstDay = firstOfMonth.getDay(); // 0..6 (Sun..Sat)

	const weekStartIndex = weekStartsOn === "sunday" ? 0 : 1;
	const leadingDays = (firstDay - weekStartIndex + 7) % 7;

	const startDate = new Date(year, month0, 1 - leadingDays);

	const cells: CalendarCell[] = [];
	for (let i = 0; i < 42; i++) {
		const d = new Date(startDate);
		d.setDate(startDate.getDate() + i);

		// optional: keep your “5th/6th row” optimization
		if (i === 35 && d.getMonth() !== month0) break;

		cells.push({
			date: d,
			inCurrentMonth: d.getMonth() === month0,
		});
	}

	return cells;
}

function generateGrid(options: GenerateDatesOptions): CalendarCell[][] {
	const cells = generateCalendarCells(options);
	const rows: CalendarCell[][] = [];
	for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
	return rows;
}

export default function SidebarCalendar() {
	const [selectedYear, setSelectedYear] = useState(() =>
		new Date().getFullYear()
	);
	const [selectedMonth, setSelectedMonth] = useState<MonthIndex>(
		() => (new Date().getMonth() + 1) as MonthIndex
	);
	const [weekStartsOn, setWeekStartsOn] = useState<WeekStartDay>("monday");

	const decYear = useCallback(
		(by: number) => setSelectedYear((y) => y - by),
		[]
	);
	const incYear = useCallback(
		(by: number) => setSelectedYear((y) => y + by),
		[]
	);
	const decMonth = useCallback(() => {
		setSelectedMonth((m) => {
			if (m === 1) {
				setSelectedYear((y) => y - 1);
				return 12;
			}
			return (m - 1) as MonthIndex;
		});
	}, []);

	const incMonth = useCallback(() => {
		setSelectedMonth((m) => {
			if (m === 12) {
				setSelectedYear((y) => y + 1);
				return 1;
			}
			return (m + 1) as MonthIndex;
		});
	}, []);

	const weekdayLabels = WEEKDAY_LABELS[weekStartsOn];

	const grid = useMemo(
		() =>
			generateGrid({
				year: selectedYear,
				month: selectedMonth,
				weekStartsOn,
			}),
		[selectedYear, selectedMonth, weekStartsOn]
	);

	function SelectYear() {
		const years = useMemo(() => generateYearItems(), [selectedYear]);

		function generateYearItems() {
			const currentYear = selectedYear;
			const years = [];
			for (let y = currentYear - 10; y <= currentYear + 10; y++) {
				years.push(y.toString());
			}
			return years;
		}

		return (
			<Select
				value={selectedYear.toString()}
				onValueChange={(val) => setSelectedYear(Number(val))}
				disablePreventBodyScroll
				// renderValue enables SSR support by providing the label synchronously
				renderValue={(value) => <Text>{value}</Text>}
			>
				<Select.Trigger
					flex={1}
					minWidth={0}
					style={{ borderRadius: 0 }}
				>
					<Select.Value placeholder="Select year" />
				</Select.Trigger>

				<Select.Content zIndex={200000}>
					<Select.Viewport>
						<Select.Group>
							{useMemo(
								() =>
									years.map((year, i) => (
										<Select.Item
											index={i}
											key={year}
											value={year}
										>
											<Select.ItemText>
												{year}
											</Select.ItemText>
											<Select.ItemIndicator marginLeft="auto">
												<Check size={16} />
											</Select.ItemIndicator>
										</Select.Item>
									)),
								[years]
							)}
						</Select.Group>
					</Select.Viewport>
				</Select.Content>
			</Select>
		);
	}

	function SelectMonth() {
		const monthNames = {
			1: "January",
			2: "February",
			3: "March",
			4: "April",
			5: "May",
			6: "June",
			7: "July",
			8: "August",
			9: "September",
			10: "October",
			11: "November",
			12: "December",
		} as const;

		return (
			<Select
				value={selectedMonth.toString()}
				onValueChange={(val) =>
					setSelectedMonth(Number(val) as MonthIndex)
				}
				disablePreventBodyScroll
				// renderValue enables SSR support by providing the label synchronously
				renderValue={(value) => (
					<Text>{monthNames[Number(value) as MonthIndex]}</Text>
				)}
			>
				<Select.Trigger
					flex={1}
					minWidth={0}
					style={{ borderRadius: 0 }}
				>
					<Select.Value placeholder="Select month" />
				</Select.Trigger>

				<Select.Content zIndex={200000}>
					<Select.Viewport>
						<Select.Group>
							{/* for longer lists memoizing these is useful */}
							{useMemo(
								() =>
									Object.entries(monthNames).map(
										([key, monthName], i) => (
											<Select.Item
												index={i}
												key={monthName}
												value={key}
											>
												<Select.ItemText>
													{monthName}
												</Select.ItemText>
												<Select.ItemIndicator marginLeft="auto">
													<Check size={16} />
												</Select.ItemIndicator>
											</Select.Item>
										)
									),
								[monthNames]
							)}
						</Select.Group>
					</Select.Viewport>
				</Select.Content>
			</Select>
		);
	}

	return (
		<View>
			{/* Calendar Header */}
			<YStack gap="$2" width="100%">
				<XGroup>
					<XGroup.Item>
						<StyledButton width="$2" onPress={() => decYear(10)}>
							<Text>{"<<<"}</Text>
						</StyledButton>
					</XGroup.Item>

					<Separator vertical />

					<XGroup.Item>
						<StyledButton width="$2" onPress={() => decYear(1)}>
							<Text>{"<"}</Text>
						</StyledButton>
					</XGroup.Item>

					<XGroup.Item>
						<SelectYear />
					</XGroup.Item>
					<XGroup.Item>
						<StyledButton width="$2" onPress={() => incYear(1)}>
							<Text>{">"}</Text>
						</StyledButton>
					</XGroup.Item>

					<Separator vertical />

					<XGroup.Item>
						<StyledButton width="$2" onPress={() => incYear(10)}>
							<Text>{">>>"}</Text>
						</StyledButton>
					</XGroup.Item>
				</XGroup>
				<XGroup>
					<XGroup.Item>
						<StyledButton
							style={{ width: "77px" }}
							onPress={decMonth}
						>
							<Text>{"<"}</Text>
						</StyledButton>
					</XGroup.Item>

					<XGroup.Item>
						<SelectMonth />
					</XGroup.Item>
					<XGroup.Item>
						<StyledButton
							style={{ width: "77px" }}
							onPress={incMonth}
						>
							<Text>{">"}</Text>
						</StyledButton>
					</XGroup.Item>
				</XGroup>

				{/* Weekday header */}
				<XStack gap="$2" width="100%" style={{ textAlign: "center" }}>
					{weekdayLabels.map((d) => (
						<Text width="100%" key={d} flex={1} fontWeight="$2">
							{d}
						</Text>
					))}
				</XStack>

				{/* Calendar grid */}
				{grid.map((row, rowIndex) => (
					<XStack gap="$2" width="100%" key={rowIndex}>
						{row.map((cell) => (
							<StyledButton
								bg={cell.inCurrentMonth ? "$color4" : "$color3"}
								key={cell.date.getTime()}
								flex={1}
								minW={0}
								aspectRatio={1}
							>
								<Text fontSize="$3">{cell.date.getDate()}</Text>
							</StyledButton>
						))}
					</XStack>
				))}
			</YStack>
		</View>
	);
}
