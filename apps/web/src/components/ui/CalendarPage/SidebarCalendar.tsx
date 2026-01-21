"use client";

import { useCalendarStore } from "@repo/hooks";
import { CalendarCellProps } from "@repo/types";
import { StyledButton } from "@repo/ui";
import { generateGrid, Month, Week } from "@repo/utils";
import {
	ArrowBigLeft,
	ArrowBigLeftDash,
	ArrowBigRight,
	ArrowBigRightDash,
	Check,
} from "@tamagui/lucide-icons";
import { useEffect, useMemo, useRef, useState } from "react";
import {
	ButtonProps,
	Select,
	Separator,
	Text,
	View,
	XGroup,
	XStack,
	YStack,
} from "tamagui";

export default function SidebarCalendar() {
	const { selectedDate, currentDate, weekStartsOn, setSelectedDate } =
		useCalendarStore();

	const [sidebarDate, setSidebarDate] = useState<Date>(
		new Date(selectedDate),
	);

	const wheelableYStackRef = useRef<HTMLDivElement | null>(null);
	const wheelableYearXGroupRef = useRef<HTMLDivElement | null>(null);
	const wheelableMonthXGroupRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const wheelableYStack = wheelableYStackRef.current;
		const wheelableYearXGroup = wheelableYearXGroupRef.current;
		const wheelableMonthXGroup = wheelableMonthXGroupRef.current;
		if (!wheelableYStack || !wheelableYearXGroup || !wheelableMonthXGroup)
			return;

		const handleMonthWheel = (e: WheelEvent) => {
			// Only triggers while the cursor is over this Calendar wrapper.
			e.preventDefault();
			e.stopPropagation();

			if (e.deltaY > 0) {
				incMonthSidebar();
				return;
			}

			if (e.deltaY < 0) {
				decMonthSidebar();
			}
		};

		const handleYearWheel = (e: WheelEvent) => {
			// Only triggers while the cursor is over this Calendar wrapper.
			e.preventDefault();
			e.stopPropagation();

			if (e.deltaY > 0) {
				incYearSidebar(1);
				return;
			}

			if (e.deltaY < 0) {
				decYearSidebar(1);
			}
		};

		wheelableYStack.addEventListener("wheel", handleMonthWheel, {
			passive: false,
		});
		wheelableYearXGroup.addEventListener("wheel", handleYearWheel, {
			passive: false,
		});
		wheelableMonthXGroup.addEventListener("wheel", handleMonthWheel, {
			passive: false,
		});

		return () => {
			wheelableYStack.removeEventListener("wheel", handleMonthWheel);
			wheelableYearXGroup.removeEventListener("wheel", handleYearWheel);
			wheelableMonthXGroup.removeEventListener("wheel", handleMonthWheel);
		};
	}, [incMonthSidebar, decMonthSidebar, incYearSidebar, decYearSidebar]);

	useEffect(() => {
		setSidebarDate(new Date(selectedDate));
	}, [selectedDate]);

	function decYearSidebar(by: number) {
		setSidebarDate(
			(prev) => new Date(prev.setFullYear(prev.getFullYear() - by)),
		);
	}

	function incYearSidebar(by: number) {
		setSidebarDate(
			(prev) => new Date(prev.setFullYear(prev.getFullYear() + by)),
		);
	}

	function decMonthSidebar() {
		setSidebarDate((prev) => new Date(prev.setMonth(prev.getMonth() - 1)));
	}

	function incMonthSidebar() {
		setSidebarDate((prev) => new Date(prev.setMonth(prev.getMonth() + 1)));
	}

	const grid = useMemo(
		() =>
			generateGrid({
				selectedDate: sidebarDate,
				weekStartsOn,
				viewType: "month",
			}),
		[sidebarDate, weekStartsOn],
	);

	function handleDaySelect(date: Date) {
		setSelectedDate(new Date(date));
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
							sidebarDate.getDate(),
						),
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
					[years],
				)}
			/>
		);
	}

	function SelectMonth() {
		return (
			<SelectElement
				value={Month.months[sidebarDate.getMonth()]}
				onValueChange={(val) =>
					setSidebarDate(
						new Date(
							sidebarDate.getFullYear(),
							Number(
								Object.keys(Month.months).find(
									(key) =>
										Month.months[
											Number(
												key,
											) as keyof typeof Month.months
										] === val,
								),
							),
							sidebarDate.getDate(),
						),
					)
				}
				renderValue={() => (
					<Text>{Month.months[sidebarDate.getMonth()]}</Text>
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
							),
						),
					[Month.months],
				)}
			/>
		);
	}

	function decideBgColor(cell: CalendarCellProps): ButtonProps {
		if (cell.date.toDateString() === selectedDate.toDateString()) {
			return {
				bg: "$accent4",
				outlineWidth: 2,
				outlineColor: "$accent9",
				outlineStyle: "solid",
			};
		}
		if (cell.date.toDateString() === currentDate.toDateString()) {
			return { bg: "$accent3" };
		}
		if (!cell.inCurrentMonth) {
			return { bg: "$color3" };
		}
		return { bg: "$color4" };
	}

	return (
		<View>
			{/* Calendar Header */}
			<YStack gap="$2" width="100%">
				{/* Year Selector */}
				<XGroup ref={wheelableYearXGroupRef}>
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
				<XGroup ref={wheelableMonthXGroupRef}>
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

				<Separator />

				<YStack ref={wheelableYStackRef} flex={1} minW={0} gap="$2">
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
									key={cell.date.getTime()}
									{...decideBgColor(cell)}
									flex={1}
									minW={0}
									aspectRatio={1}
									onPress={() => handleDaySelect(cell.date)}
								>
									<Text fontSize="$3">
										{cell.date.getDate()}
									</Text>
								</StyledButton>
							))}
						</XStack>
					))}
				</YStack>
			</YStack>
		</View>
	);
}
