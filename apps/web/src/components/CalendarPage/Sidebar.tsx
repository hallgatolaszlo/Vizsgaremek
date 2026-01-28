"use client";

import { useCalendarStore, useProfileStore } from "@repo/hooks";
import { CalendarCellProps, components } from "@repo/types";
import { SelectElement, StyledButton } from "@repo/ui";
import { generateGrid, getContrastFromHSLA, Month, Week } from "@repo/utils";
import {
	ArrowBigLeft,
	ArrowBigLeftDash,
	ArrowBigRight,
	ArrowBigRightDash,
	CalendarPlus,
	Check,
} from "@tamagui/lucide-icons";
import { UseQueryResult } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import {
	ButtonProps,
	Checkbox,
	H3,
	Label,
	ListItem,
	Popover,
	Select,
	Separator,
	Spinner,
	Text,
	useTheme,
	XGroup,
	XStack,
	YGroup,
	YStack,
} from "tamagui";
import { FullscreenView } from "../FullscreenView";
import { CreateCalendarForm } from "./CreateCalendarForm";

type getCalendarDTO = components["schemas"]["GetCalendarDTO"];

interface SidebarProps {
	myCalendarsQuery: UseQueryResult<getCalendarDTO[]>;
}

export default function Sidebar(props: SidebarProps) {
	const { selectedDate, currentDate, setSelectedDate } = useCalendarStore();
	const [checkedCalendars, setCheckedCalendars] =
		useState<Record<string, boolean>>();

	const { locale, weekStartsOn } = useProfileStore();

	const [sidebarDate, setSidebarDate] = useState<Date>(
		new Date(selectedDate),
	);

	const calendarTheme = useTheme({ name: "calendarColors" });

	const wheelableYStackRef = useRef<HTMLDivElement | null>(null);
	const wheelableYearXGroupRef = useRef<HTMLDivElement | null>(null);
	const wheelableMonthXGroupRef = useRef<HTMLDivElement | null>(null);

	const { isPending, error, data } = props.myCalendarsQuery;

	useEffect(() => {
		if (data) {
			const dict = {} as Record<string, boolean>;
			data.forEach((calendar) => {
				if (!calendar.id) return;
				dict[calendar.id] = true;
			});
			setCheckedCalendars(dict);
		}
	}, [data]);

	function handleCheckboxChange(calendarId: string, checked: boolean) {
		if (checked) {
			setCheckedCalendars((prev) => ({ ...prev, [calendarId]: true }));
		} else {
			setCheckedCalendars((prev) => {
				const updated = { ...prev };
				delete updated[calendarId];
				return updated;
			});
		}
	}

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
				triggerStyle={{ borderRadius: 0 }}
			/>
		);
	}

	function SelectMonth() {
		const months = useMemo(() => {
			return Month.getMonthsLabels(locale, "long");
		}, [locale]);

		return (
			<SelectElement
				value={months[sidebarDate.getMonth()]}
				onValueChange={(val) =>
					setSidebarDate(
						new Date(
							sidebarDate.getFullYear(),
							months.indexOf(val),
							sidebarDate.getDate(),
						),
					)
				}
				renderValue={() => (
					<Text>{months[sidebarDate.getMonth()]}</Text>
				)}
				triggerPlaceholder="Select month"
				groupItems={useMemo(
					() =>
						months.map((monthName, i) => (
							<Select.Item index={i} key={i} value={monthName}>
								<Select.ItemText>{monthName}</Select.ItemText>
								<Select.ItemIndicator marginLeft="auto">
									<Check size={16} />
								</Select.ItemIndicator>
							</Select.Item>
						)),
					[months],
				)}
				triggerStyle={{ borderRadius: 0 }}
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
		<FullscreenView
			maxHeight
			flex={1}
			px={"$4"}
			bg="$color2"
			style={{ minWidth: 400, maxWidth: 400 }}
			stack="YStack"
			overflow="scroll"
			gap={"$2"}
		>
			{/* Year Selector */}
			<XGroup mt={"$2"} ref={wheelableYearXGroupRef}>
				<XGroup.Item>
					<StyledButton width="$2" onPress={() => decYearSidebar(10)}>
						<Text>
							<ArrowBigLeftDash />
						</Text>
					</StyledButton>
				</XGroup.Item>

				<Separator vertical />

				<XGroup.Item>
					<StyledButton width="$2" onPress={() => decYearSidebar(1)}>
						<Text>{<ArrowBigLeft />}</Text>
					</StyledButton>
				</XGroup.Item>

				<XGroup.Item>
					<SelectYear />
				</XGroup.Item>
				<XGroup.Item>
					<StyledButton width="$2" onPress={() => incYearSidebar(1)}>
						<Text>{<ArrowBigRight />}</Text>
					</StyledButton>
				</XGroup.Item>

				<Separator vertical />

				<XGroup.Item>
					<StyledButton width="$2" onPress={() => incYearSidebar(10)}>
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

			<YStack ref={wheelableYStackRef} minW={0} gap="$2">
				{/* Weekday header */}
				<XStack
					mt="$2"
					gap="$2"
					width="100%"
					style={{ textAlign: "center" }}
				>
					{Week.getWeekdayLabels(locale, "short", weekStartsOn).map(
						(d, i) => (
							<Text width="100%" key={i} fontWeight="$2">
								{d}
							</Text>
						),
					)}
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
								<Text
									style={{ userSelect: "none" }}
									fontSize="$3"
								>
									{cell.date.getDate()}
								</Text>
							</StyledButton>
						))}
					</XStack>
				))}
			</YStack>

			<Separator my={"$2"} />

			<XStack
				style={{
					userSelect: "none",
					textAlign: "center",
					flexShrink: 0,
					alignItems: "center",
					justifyContent: "space-between",
				}}
			>
				<H3
					style={{
						userSelect: "none",
						textAlign: "center",
					}}
				>
					My calendars
				</H3>
				<Popover scope="create-calendar" placement="bottom-start">
					<Popover.Trigger asChild>
						<StyledButton>
							<Text>{<CalendarPlus />}</Text>
						</StyledButton>
					</Popover.Trigger>
					<Popover.Content
						style={{ padding: 0 }}
						enterStyle={{ y: -10, opacity: 0 }}
						exitStyle={{ y: -10, opacity: 0 }}
						elevate
						animation={[
							"quick",
							{
								opacity: {
									overshootClamping: true,
								},
							},
						]}
					>
						<Popover.Arrow />
						<CreateCalendarForm />
					</Popover.Content>
				</Popover>
			</XStack>

			<YStack
				style={{
					border: "2px solid var(--color5)",
					borderRadius: 10,
					flexShrink: 1,
					minHeight: "30vh",
					justifyContent:
						isPending || error ? "center" : "flex-start",
					overflowX: "hidden",
					overflowY: "scroll",
				}}
				flex={1}
				overflow="scroll"
			>
				{isPending && <Spinner size="large" color={"$accent5"} />}
				{error && <Text>Error loading calendars</Text>}
				<YGroup>
					{data &&
						data.map((calendar) => (
							<YGroup.Item key={calendar.id}>
								<ListItem py={0}>
									<XStack
										gap={"$3"}
										style={{ alignItems: "center" }}
									>
										<Checkbox
											id={`checkbox-${calendar.id}`}
											checked={
												calendar.id &&
												checkedCalendars?.[calendar.id]
													? true
													: false
											}
											onCheckedChange={(checked) =>
												handleCheckboxChange(
													calendar.id!,
													checked === true,
												)
											}
											style={{
												backgroundColor:
													calendar.id &&
													checkedCalendars?.[
														calendar.id
													]
														? calendarTheme[
																`color${calendar.color}` as keyof typeof calendarTheme
															]?.val
														: "var(--color3)",
												border:
													"2px solid " +
													calendarTheme[
														`color${calendar.color}` as keyof typeof calendarTheme
													]?.val,
											}}
											hoverStyle={{
												backgroundColor:
													calendar.id &&
													checkedCalendars?.[
														calendar.id
													]
														? calendarTheme[
																`color${calendar.color}` as keyof typeof calendarTheme
															]?.val
														: "$color4",
												borderColor:
													calendarTheme[
														`color${calendar.color}` as keyof typeof calendarTheme
													]?.val,
											}}
											focusStyle={{
												backgroundColor:
													calendar.id &&
													checkedCalendars?.[
														calendar.id
													]
														? calendarTheme[
																`color${calendar.color}` as keyof typeof calendarTheme
															]?.val
														: "$color4",
												borderColor:
													calendarTheme[
														`color${calendar.color}` as keyof typeof calendarTheme
													]?.val,
											}}
										>
											<Checkbox.Indicator>
												<Check
													strokeWidth={3}
													color={getContrastFromHSLA(
														calendarTheme[
															`color${calendar.color}` as keyof typeof calendarTheme
														]?.val,
													)}
												/>
											</Checkbox.Indicator>
										</Checkbox>
										<Label
											htmlFor={`checkbox-${calendar.id}`}
											textOverflow="ellipsis"
											whiteSpace="nowrap"
											overflow="hidden"
											style={{
												userSelect: "none",
											}}
										>
											{calendar.name}
										</Label>
									</XStack>
								</ListItem>
							</YGroup.Item>
						))}
				</YGroup>
			</YStack>
		</FullscreenView>
	);
}
