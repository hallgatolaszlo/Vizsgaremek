"use client";

import { CalendarState } from "@repo/hooks";
import { StyledButton } from "@repo/ui";
import { calculateCellBg, generateGrid, Month, Week } from "@repo/utils";
import {
	ArrowBigLeft,
	ArrowBigLeftDash,
	ArrowBigRight,
	ArrowBigRightDash,
	Check,
} from "@tamagui/lucide-icons";
import { useEffect, useMemo, useState } from "react";
import { Select, Separator, Text, View, XGroup, XStack, YStack } from "tamagui";

interface SidebarCalendarProps {
	calendarState: CalendarState;
}

export default function SidebarCalendar({
	calendarState,
}: SidebarCalendarProps) {
	const { selectedDate, currentDate, weekStartsOn, setSelectedDate } =
		calendarState;

	const [sidebarDate, setSidebarDate] = useState<Date>(currentDate);

	useEffect(() => {
		setSidebarDate(selectedDate);
	}, [selectedDate]);

	function decYearSidebar(by: number) {
		setSidebarDate(
			(prev) =>
				new Date(
					prev.getFullYear() - by,
					prev.getMonth(),
					prev.getDate()
				)
		);
	}

	function incYearSidebar(by: number) {
		setSidebarDate(
			(prev) =>
				new Date(
					prev.getFullYear() + by,
					prev.getMonth(),
					prev.getDate()
				)
		);
	}

	function decMonthSidebar() {
		if (sidebarDate.getMonth() === 0) {
			setSidebarDate(
				(prev) => new Date(prev.getFullYear() - 1, 11, prev.getDate())
			);
			return;
		}
		setSidebarDate(
			(prev) =>
				new Date(
					prev.getFullYear(),
					prev.getMonth() - 1,
					prev.getDate()
				)
		);
	}

	function incMonthSidebar() {
		if (sidebarDate.getMonth() === 11) {
			setSidebarDate(
				(prev) => new Date(prev.getFullYear() + 1, 0, prev.getDate())
			);
			return;
		}
		setSidebarDate(
			(prev) =>
				new Date(
					prev.getFullYear(),
					prev.getMonth() + 1,
					prev.getDate()
				)
		);
	}

	const grid = useMemo(
		() =>
			generateGrid({
				selectedDate: sidebarDate,
				weekStartsOn,
				viewType: "month",
			}),
		[sidebarDate, weekStartsOn]
	);

	function handleDaySelect(date: Date) {
		setSelectedDate(date);
		setSidebarDate(date);
	}

	type SelectElementProps = {
		value: string;
		onValueChange: (value: string) => void;
		renderValue: (value: string) => React.ReactNode;
		triggerPlaceholder: string;
		groupItems: React.ReactNode[];
	};

	function SelectElement(props: SelectElementProps) {
		const {
			value,
			onValueChange,
			renderValue,
			triggerPlaceholder,
			groupItems,
		} = props;

		return (
			<Select
				value={value}
				onValueChange={onValueChange}
				disablePreventBodyScroll
				// renderValue enables SSR support by providing the label synchronously
				renderValue={renderValue}
			>
				<Select.Trigger
					flex={1}
					minWidth={0}
					style={{ borderRadius: 0 }}
				>
					<Select.Value placeholder={triggerPlaceholder} />
				</Select.Trigger>

				<Select.Content zIndex={200000}>
					<Select.Viewport>
						<Select.Group>{groupItems}</Select.Group>
					</Select.Viewport>
				</Select.Content>
			</Select>
		);
	}

	function SelectYear() {
		const years = useMemo(() => {
			const years: string[] = [];
			for (
				let y = sidebarDate.getFullYear() - 10;
				y <= sidebarDate.getFullYear() + 10;
				y++
			)
				years.push(String(y));
			return years;
		}, [sidebarDate]);

		return (
			<SelectElement
				value={sidebarDate.getFullYear().toString()}
				onValueChange={(val) =>
					setSidebarDate(
						new Date(
							Number(val),
							sidebarDate.getMonth(),
							sidebarDate.getDate()
						)
					)
				}
				renderValue={(value) => <Text>{value}</Text>}
				triggerPlaceholder="Select year"
				groupItems={useMemo(
					() =>
						years.map((year, i) => (
							<Select.Item index={i} key={year} value={year}>
								<Select.ItemText>{year}</Select.ItemText>
								<Select.ItemIndicator marginLeft="auto">
									<Check size={16} />
								</Select.ItemIndicator>
							</Select.Item>
						)),
					[years]
				)}
			/>
		);
	}

	function SelectMonth() {
		return (
			<SelectElement
				value={new Month(0, sidebarDate.getMonth()).monthLabel}
				onValueChange={(val) =>
					setSidebarDate(
						new Date(
							sidebarDate.getFullYear(),
							Number(
								Object.keys(Month.months).find(
									(key) =>
										Month.months[
											Number(
												key
											) as keyof typeof Month.months
										] === val
								)
							) - 1,
							sidebarDate.getDate()
						)
					)
				}
				renderValue={() => (
					<Text>
						{new Month(0, sidebarDate.getMonth()).monthLabel}
					</Text>
				)}
				triggerPlaceholder="Select month"
				groupItems={useMemo(
					() =>
						Object.entries(Month.months).map(
							([monthIndex, monthName], i) => (
								<Select.Item
									index={i}
									key={monthIndex}
									value={monthName}
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
					[Month.months]
				)}
			/>
		);
	}

	return (
		<View>
			{/* Calendar Header */}
			<YStack gap="$2" width="100%">
				{/* Year Selector */}
				<XGroup>
					<XGroup.Item>
						<StyledButton
							width="$2"
							onPress={() => decYearSidebar(10)}
						>
							<Text>
								<ArrowBigLeftDash />
							</Text>
						</StyledButton>
					</XGroup.Item>

					<Separator vertical />

					<XGroup.Item>
						<StyledButton
							width="$2"
							onPress={() => decYearSidebar(1)}
						>
							<Text>{<ArrowBigLeft />}</Text>
						</StyledButton>
					</XGroup.Item>

					<XGroup.Item>
						<SelectYear />
					</XGroup.Item>
					<XGroup.Item>
						<StyledButton
							width="$2"
							onPress={() => incYearSidebar(1)}
						>
							<Text>{<ArrowBigRight />}</Text>
						</StyledButton>
					</XGroup.Item>

					<Separator vertical />

					<XGroup.Item>
						<StyledButton
							width="$2"
							onPress={() => incYearSidebar(10)}
						>
							<Text>{<ArrowBigRightDash />}</Text>
						</StyledButton>
					</XGroup.Item>
				</XGroup>

				{/* Month Selector */}
				<XGroup>
					<XGroup.Item>
						<StyledButton
							style={{ width: "77px" }}
							onPress={decMonthSidebar}
						>
							<Text>{<ArrowBigLeft />}</Text>
						</StyledButton>
					</XGroup.Item>

					<XGroup.Item>
						<SelectMonth />
					</XGroup.Item>
					<XGroup.Item>
						<StyledButton
							style={{ width: "77px" }}
							onPress={incMonthSidebar}
						>
							<Text>{<ArrowBigRight />}</Text>
						</StyledButton>
					</XGroup.Item>
				</XGroup>

				{/* Weekday header */}
				<XStack
					mt="$2"
					gap="$2"
					width="100%"
					style={{ textAlign: "center" }}
				>
					{Week.getWeekdayLabels(weekStartsOn).map((d, i) => (
						<Text width="100%" key={i} flex={1} fontWeight="$2">
							{d}
						</Text>
					))}
				</XStack>

				{/* Calendar grid */}
				{Object.entries(grid).map(([weekNumber, row], rowIndex) => (
					<XStack gap="$2" width="100%" key={rowIndex}>
						{row.map((cell) => (
							<StyledButton
								bg={
									calculateCellBg(
										cell.date,
										cell.inCurrentMonth,
										selectedDate,
										currentDate,
										"month",
										true
									) as any
								}
								key={cell.date.getTime()}
								flex={1}
								minW={0}
								aspectRatio={1}
								onPress={() => handleDaySelect(cell.date)}
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
