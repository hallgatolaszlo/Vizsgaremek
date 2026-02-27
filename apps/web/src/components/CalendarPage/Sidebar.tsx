"use client";

import { deleteCalendar } from "@repo/api";
import { useCalendars, useCalendarStore, useProfileStore } from "@repo/hooks";
import { CalendarCellProps, components } from "@repo/types";
import { StyledButton } from "@repo/ui";
import { generateGrid, getContrastFromHSLA, Month, Week } from "@repo/utils";
import {
	ArrowBigLeft,
	ArrowBigLeftDash,
	ArrowBigRight,
	ArrowBigRightDash,
	CalendarPlus,
	Check,
	EllipsisVertical,
	SquarePen,
	Trash,
} from "@tamagui/lucide-icons";
import { useQueryClient } from "@tanstack/react-query";
import * as locales from "date-fns/locale";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
	AnimatePresence,
	Button,
	ButtonProps,
	Checkbox,
	GetProps,
	H3,
	ListItem,
	Popover,
	Separator,
	Spinner,
	Text,
	Tooltip,
	useTheme,
	View,
	XGroup,
	XStack,
	YGroup,
	YStack,
} from "tamagui";
import { FullscreenView } from "../FullscreenView";
import { CreateCalendarForm } from "./CreateCalendarForm";
import { UpdateCalendarForm } from "./UpdateCalendarForm";

type getCalendarDTO = components["schemas"]["GetCalendarDTO"];
type AnimationProp = GetProps<typeof YStack>["animation"];

const FADE_ANIMATION: AnimationProp = "quick";

const SIDEBAR_WIDTH = 350;

function NavButton(props: ButtonProps) {
	return (
		<StyledButton {...props}>
			<Text>{props.children}</Text>
		</StyledButton>
	);
}

// Calendar list item component
interface CalendarListItemProps {
	calendar: getCalendarDTO;
	isChecked: boolean;
	onCheckedChange: (checked: boolean) => void;
	calendarTheme: ReturnType<typeof useTheme>;
	setEditingCalendarId: (id: string | null) => void;
}

function CalendarListItem({
	calendar,
	isChecked,
	onCheckedChange,
	calendarTheme,
	setEditingCalendarId,
}: CalendarListItemProps) {
	const colorKey = `color${calendar.color}` as keyof typeof calendarTheme;
	const themeColor = calendarTheme[colorKey]?.val;

	const queryClient = useQueryClient();

	async function delCalendar(id: string) {
		await deleteCalendar(id);
		queryClient.invalidateQueries({ queryKey: ["myCalendars"] });
	}

	const checkboxStyles = useMemo(
		() => ({
			base: {
				backgroundColor: isChecked ? themeColor : "var(--color3)",
				border: `2px solid ${themeColor}`,
			},
			hover: {
				backgroundColor: isChecked ? themeColor : "$color4",
				borderColor: themeColor,
			},
		}),
		[isChecked, themeColor],
	);

	return (
		<AnimatePresence>
			<ListItem
				enterStyle={{ y: -10, opacity: 0 }}
				exitStyle={{ y: -10, opacity: 0 }}
				animation={FADE_ANIMATION}
				animateOnly={["transform", "opacity"]}
				py={0}
				display="flex"
			>
				<XStack
					style={{
						alignItems: "center",
						justifyContent: "space-between",
						width: "100%",
					}}
				>
					<XStack gap={"$3"} flexShrink={1}>
						<Checkbox
							checked={isChecked}
							onCheckedChange={(checked) =>
								onCheckedChange(checked === true)
							}
							style={checkboxStyles.base}
							hoverStyle={checkboxStyles.hover}
							focusStyle={checkboxStyles.hover}
						>
							<Checkbox.Indicator>
								<Check
									strokeWidth={3}
									color={getContrastFromHSLA(themeColor)}
								/>
							</Checkbox.Indicator>
						</Checkbox>
						<Tooltip>
							<Tooltip.Trigger asChild>
								<Text
									textOverflow="ellipsis"
									whiteSpace="nowrap"
									overflow="hidden"
									style={{ userSelect: "none" }}
								>
									{calendar.name}
								</Text>
							</Tooltip.Trigger>
							<Tooltip.Content backgroundColor={"$color10"}>
								<Tooltip.Arrow
									size={"$4"}
									backgroundColor={"$color10"}
								/>
								<Text color={"$color2"}>{calendar.name}</Text>
							</Tooltip.Content>
						</Tooltip>
					</XStack>
					<Popover placement="bottom-end">
						<Popover.Trigger asChild>
							<Button
								unstyled
								icon={<EllipsisVertical />}
								scaleIcon={1.25}
								size="$3"
								borderWidth={0}
								bg="transparent"
								aspectRatio={1}
								display="flex"
								style={{
									borderTopLeftRadius: "50%",
									borderBottomLeftRadius: "50%",
									borderTopRightRadius: "50%",
									borderBottomRightRadius: "50%",
									alignItems: "center",
									justifyContent: "center",
								}}
								cursor="pointer"
								hoverStyle={{ bg: "$color3" }}
								animation={FADE_ANIMATION}
							/>
						</Popover.Trigger>
						<Popover.Content
							style={{
								outlineWidth: 2,
								outlineColor: "var(--color5)",
								outlineStyle: "solid",
								borderRadius: 10,
								padding: 3,
								backgroundColor: "var(--color2)",
							}}
							enterStyle={{ y: -10, opacity: 0 }}
							exitStyle={{ y: -10, opacity: 0 }}
							elevate
							animation={FADE_ANIMATION}
						>
							<Popover.Arrow
								size="$4"
								borderWidth={2}
								borderColor="$color6"
								bg="$color2"
							/>
							<ListItem
								p={0}
								style={{
									borderTopLeftRadius: 10,
									borderTopRightRadius: 10,
								}}
							>
								<StyledButton
									iconAfter={<SquarePen />}
									width={"100%"}
									bg={"$color2"}
									hoverStyle={{
										bg: "$color3",
										outlineWidth: 0,
									}}
									style={{
										display: "flex",
										justifyContent: "space-between",
									}}
									onPress={() =>
										setEditingCalendarId(calendar.id!)
									}
								>
									<Text fontWeight={"$2"}>Edit</Text>
								</StyledButton>
							</ListItem>
							<ListItem
								p={0}
								style={{
									borderBottomLeftRadius: 10,
									borderBottomRightRadius: 10,
								}}
							>
								<StyledButton
									iconAfter={<Trash />}
									width={"100%"}
									bg={"$color2"}
									hoverStyle={{
										bg: "$color3",
										outlineWidth: 0,
									}}
									style={{
										display: "flex",
										justifyContent: "space-between",
									}}
									onPress={() => {
										if (
											confirm(
												"Are you sure you want to delete this calendar?",
											)
										) {
											delCalendar(calendar.id!);
										}
									}}
								>
									<Text fontWeight={"$2"}>Delete</Text>
								</StyledButton>
							</ListItem>
						</Popover.Content>
					</Popover>
				</XStack>
			</ListItem>
		</AnimatePresence>
	);
}

export default function Sidebar() {
	const {
		selectedDate,
		currentDate,
		setSelectedDate,
		checkedCalendarIds,
		setCheckedCalendarIds,
		hideSidebar,
		mobileView,
		tabletView,
	} = useCalendarStore();
	const { locale, weekStartsOn } = useProfileStore();

	const calendarTheme = useTheme({ name: "calendarColors" });

	const { isPending, error, data } = useCalendars();

	const [createCalendarOpen, setCreateCalendarOpen] = useState(false);

	const [editingCalendarId, setEditingCalendarId] = useState<string | null>(
		null,
	);

	const [sidebarDate, setSidebarDate] = useState<Date>(
		() => new Date(selectedDate),
	);

	const wheelableYStackRef = useRef<HTMLDivElement>(null);
	const wheelableYearXGroupRef = useRef<HTMLDivElement>(null);
	const wheelableMonthXGroupRef = useRef<HTMLDivElement>(null);

	// Navigation handlers
	const decYearSidebar = useCallback((by: number) => {
		setSidebarDate(
			(prev) =>
				new Date(
					prev.getFullYear() - by,
					prev.getMonth(),
					prev.getDate(),
				),
		);
	}, []);

	const incYearSidebar = useCallback((by: number) => {
		setSidebarDate(
			(prev) =>
				new Date(
					prev.getFullYear() + by,
					prev.getMonth(),
					prev.getDate(),
				),
		);
	}, []);

	const decMonthSidebar = useCallback(() => {
		setSidebarDate(
			(prev) =>
				new Date(
					prev.getFullYear(),
					prev.getMonth() - 1,
					prev.getDate(),
				),
		);
	}, []);

	const incMonthSidebar = useCallback(() => {
		setSidebarDate(
			(prev) =>
				new Date(
					prev.getFullYear(),
					prev.getMonth() + 1,
					prev.getDate(),
				),
		);
	}, []);

	// Initialize checked calendars from data
	useEffect(() => {
		if (!data) return;

		const calendarIds: string[] = [];
		data.forEach((calendar) => {
			if (calendar.id) calendarIds.push(calendar.id);
		});
		setCheckedCalendarIds(calendarIds);
	}, [data, setCheckedCalendarIds]);

	// Sync sidebar date with selected date
	useEffect(() => {
		async function nemtom() {
			setSidebarDate(new Date(selectedDate));
		}
		nemtom();
	}, [selectedDate]);

	// Wheel event handlers
	useEffect(() => {
		const wheelableYStack = wheelableYStackRef.current;
		const wheelableYearXGroup = wheelableYearXGroupRef.current;
		const wheelableMonthXGroup = wheelableMonthXGroupRef.current;

		if (!wheelableYStack || !wheelableYearXGroup || !wheelableMonthXGroup)
			return;

		const handleMonthWheel = (e: WheelEvent) => {
			e.preventDefault();
			e.stopPropagation();
			if (e.deltaY > 0) incMonthSidebar();
			else if (e.deltaY < 0) decMonthSidebar();
		};

		const handleYearWheel = (e: WheelEvent) => {
			e.preventDefault();
			e.stopPropagation();
			if (e.deltaY > 0) incYearSidebar(1);
			else if (e.deltaY < 0) decYearSidebar(1);
		};

		const options = { passive: false };
		wheelableYStack.addEventListener("wheel", handleMonthWheel, options);
		wheelableYearXGroup.addEventListener("wheel", handleYearWheel, options);
		wheelableMonthXGroup.addEventListener(
			"wheel",
			handleMonthWheel,
			options,
		);

		return () => {
			wheelableYStack.removeEventListener("wheel", handleMonthWheel);
			wheelableYearXGroup.removeEventListener("wheel", handleYearWheel);
			wheelableMonthXGroup.removeEventListener("wheel", handleMonthWheel);
		};
	}, [incMonthSidebar, decMonthSidebar, incYearSidebar, decYearSidebar]);

	const handleCheckboxChange = useCallback(
		(calendarId: string, checked: boolean) => {
			if (checked && !checkedCalendarIds.includes(calendarId)) {
				setCheckedCalendarIds([...checkedCalendarIds, calendarId]);
			} else if (!checked) {
				setCheckedCalendarIds(
					checkedCalendarIds.filter((id) => id !== calendarId),
				);
			}
		},
		[setCheckedCalendarIds, checkedCalendarIds],
	);

	const handleDaySelect = useCallback(
		(date: Date) => setSelectedDate(new Date(date)),
		[setSelectedDate],
	);

	const grid = useMemo(
		() =>
			generateGrid({
				selectedDate: sidebarDate,
				weekStartsOn,
				viewType: "month",
			}),
		[sidebarDate, weekStartsOn],
	);

	const weekdayLabels = useMemo(
		() => Week.getWeekdayLabels(locale, "short", weekStartsOn),
		[locale, weekStartsOn],
	);

	const getCellStyle = useCallback(
		(cell: CalendarCellProps): ButtonProps => {
			const dateStr = cell.date.toDateString();

			if (dateStr === selectedDate.toDateString()) {
				return {
					bg: "$accent4",
					outlineWidth: 2,
					outlineColor: "$accent9",
					outlineStyle: "solid",
				};
			}
			if (dateStr === currentDate.toDateString()) {
				return { bg: "$accent3" };
			}
			if (!cell.inCurrentMonth) {
				return { bg: "$color3" };
			}
			return { bg: "$color4" };
		},
		[selectedDate, currentDate],
	);

	const handleYearChange = useCallback((val: string) => {
		setSidebarDate(
			(prev) => new Date(Number(val), prev.getMonth(), prev.getDate()),
		);
	}, []);

	// Month selector component
	const months = useMemo(
		() => Month.getMonthsLabels(locale, "long"),
		[locale],
	);

	const handleMonthChange = useCallback(
		(val: string) => {
			setSidebarDate(
				(prev) =>
					new Date(
						prev.getFullYear(),
						months.indexOf(val),
						prev.getDate(),
					),
			);
		},
		[months],
	);

	// Convert Intl.Locale to date-fns locale code and register
	useMemo(() => {
		if (locale instanceof Intl.Locale) {
			const localeCode = locale.language;
			const dateLocale = locales[localeCode as keyof typeof locales];
			if (dateLocale) {
				registerLocale(localeCode, dateLocale);
			}
		}
	}, [locale]);

	return (
		<FullscreenView
			maxHeightDefined
			pt={"$2"}
			pl={"$4"}
			pr={"$2"}
			bg="$color2"
			width={SIDEBAR_WIDTH}
			stack="YStack"
			overflow="scroll"
			gap="$2"
			display={hideSidebar ? "none" : "flex"}
			position={mobileView || tabletView ? "absolute" : "relative"}
			z={1500}
			borderRightWidth={2}
			borderRightColor={"$color5"}
		>
			{/* Year Selector */}
			<XGroup ref={wheelableYearXGroupRef}>
				<XGroup.Item>
					<NavButton
						style={{ flexShrink: 1 }}
						onPress={() => decYearSidebar(10)}
						width={40}
					>
						<Text>
							<ArrowBigLeftDash />
						</Text>
					</NavButton>
				</XGroup.Item>
				<Separator vertical />
				<XGroup.Item>
					<NavButton
						style={{ flexShrink: 1 }}
						onPress={() => decYearSidebar(1)}
						width={40}
					>
						<Text>
							<ArrowBigLeft />
						</Text>
					</NavButton>
				</XGroup.Item>
				<Separator vertical />
				<XGroup.Item>
					<View style={{ width: 150 }}>
						<DatePicker
							selected={sidebarDate}
							onChange={(date: Date | null) => {
								if (date)
									handleYearChange(
										String(date.getFullYear()),
									);
							}}
							showYearPicker
							dateFormat="yyyy"
							className="custom-datepicker"
							wrapperClassName="custom-datepicker-wrapper"
						/>
					</View>
				</XGroup.Item>
				<Separator vertical />
				<XGroup.Item>
					<NavButton
						style={{ flexShrink: 1 }}
						onPress={() => incYearSidebar(1)}
						width={40}
					>
						<Text>
							<ArrowBigRight />
						</Text>
					</NavButton>
				</XGroup.Item>
				<Separator vertical />
				<XGroup.Item>
					<NavButton
						style={{ flexShrink: 1 }}
						onPress={() => incYearSidebar(10)}
						width={40}
					>
						<Text>
							<ArrowBigRightDash />
						</Text>
					</NavButton>
				</XGroup.Item>
			</XGroup>

			{/* Month Selector */}
			<XGroup ref={wheelableMonthXGroupRef}>
				<XGroup.Item>
					<NavButton
						style={{ flexShrink: 1 }}
						onPress={decMonthSidebar}
						width={80}
					>
						<Text>
							<ArrowBigLeft />
						</Text>
					</NavButton>
				</XGroup.Item>
				<Separator vertical />
				<XGroup.Item>
					<View style={{ width: 150 }}>
						<DatePicker
							selected={sidebarDate}
							onChange={(date: Date | null) => {
								if (date)
									handleMonthChange(months[date.getMonth()]);
							}}
							renderCustomHeader={() => <></>}
							showMonthYearPicker
							showFullMonthYearPicker
							showTwoColumnMonthYearPicker
							dateFormat="MMMM"
							locale={
								locale instanceof Intl.Locale
									? locale.language
									: "en"
							}
							className="custom-datepicker"
							wrapperClassName="custom-datepicker-wrapper"
						/>
					</View>
				</XGroup.Item>
				<Separator vertical />
				<XGroup.Item>
					<NavButton
						style={{ flexShrink: 1 }}
						onPress={incMonthSidebar}
						width={80}
					>
						<Text>
							<ArrowBigRight />
						</Text>
					</NavButton>
				</XGroup.Item>
			</XGroup>

			<Separator />

			{/* Calendar Grid */}
			<YStack ref={wheelableYStackRef} minW={0} gap="$2">
				<XStack
					mt="$2"
					gap="$2"
					width="100%"
					style={{ textAlign: "center" }}
				>
					{weekdayLabels.map((day, i) => (
						<Text width="100%" key={i} fontWeight="bold">
							{day}
						</Text>
					))}
				</XStack>

				{Object.entries(grid).map(([, row], rowIndex) => (
					<XStack gap="$2" width="100%" key={rowIndex}>
						{row.map((cell) => (
							<StyledButton
								key={cell.date.getTime()}
								{...getCellStyle(cell)}
								flexBasis={0}
								minW={0}
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

			<Separator my="$2" />

			{/* Calendars Header */}
			<XStack
				style={{
					userSelect: "none",
					flexShrink: 0,
					alignItems: "center",
					justifyContent: "space-between",
				}}
			>
				<H3 style={{ userSelect: "none" }}>My calendars</H3>
			</XStack>

			{/* Calendars List */}
			<YStack
				style={{
					border: "2px solid var(--color5)",
					borderRadius: 10,
					flexShrink: 1,
					justifyContent:
						isPending || error || data?.length === 0
							? "center"
							: "flex-start",
					overflowX: "hidden",
					overflowY: "auto",
				}}
				minH="30vh"
				flex={1}
			>
				{isPending && <Spinner size="large" color="$accent5" />}
				{error && (
					<Text style={{ textAlign: "center" }}>
						Error loading calendars
					</Text>
				)}
				{data?.length === 0 && (
					<Text style={{ textAlign: "center" }}>
						{"No calendars yet :("}
					</Text>
				)}
				<YGroup mt={5}>
					{data?.map((calendar) => (
						<YGroup.Item key={calendar.id}>
							{calendar.id === editingCalendarId ? (
								<UpdateCalendarForm
									calendar={calendar}
									onSuccess={() => setEditingCalendarId(null)}
									onCancel={() => setEditingCalendarId(null)}
								/>
							) : (
								<CalendarListItem
									setEditingCalendarId={setEditingCalendarId}
									calendar={calendar}
									isChecked={Boolean(
										calendar.id &&
										checkedCalendarIds.includes(
											calendar.id,
										),
									)}
									onCheckedChange={(checked) =>
										handleCheckboxChange(
											calendar.id!,
											checked,
										)
									}
									calendarTheme={calendarTheme}
								/>
							)}
						</YGroup.Item>
					))}
				</YGroup>
				{!isPending && !createCalendarOpen && (
					<StyledButton
						style={{ margin: "5px 15px" }}
						onPress={() => setCreateCalendarOpen(true)}
					>
						<Text
							style={{
								userSelect: "none",
								display: "flex",
								alignItems: "center",
								gap: 10,
							}}
						>
							Create new calendar
							<CalendarPlus />
						</Text>
					</StyledButton>
				)}
				{createCalendarOpen && (
					<CreateCalendarForm
						onSuccess={() => setCreateCalendarOpen(false)}
						onCancel={() => setCreateCalendarOpen(false)}
					/>
				)}
			</YStack>
		</FullscreenView>
	);
}
