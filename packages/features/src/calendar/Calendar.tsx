import { CalendarEntryHourView } from "@/src/components/CalendarPage/CalendarEntryHourView";
import { CreateCalendarEntryForm } from "@/src/components/CalendarPage/CreateCalendarEntryForm";
import CustomDialog from "@/src/components/CalendarPage/CustomDialog";
import {
	useCalendarEntries,
	useCalendars,
	useCalendarStore,
	useDialogStore,
	useProfileStore,
} from "@repo/hooks";
import { CalendarCellProps } from "@repo/types";
import { StyledButton } from "@repo/ui";
import {
	generateGrid,
	getPositionedEntries,
	isNative,
	PositionedEntry,
	Week,
} from "@repo/utils";
import { Plus } from "@tamagui/lucide-icons";
import { useCallback, useMemo, useState } from "react";
import {
	Card,
	Dialog,
	ScrollView,
	Text,
	useMedia,
	XStack,
	YStack,
} from "tamagui";
import CalendarCell from "./CalendarCell";

// Constants
const BORDER_WIDTH = 1;
const BORDER_COLOR = "var(--color5)";
const HOURS_IN_DAY = 24;
const DAYS_IN_WEEK = 7;

// Common styles
const containerStyle = {
	margin: "0px",
	borderRadius: "0px",
	overflow: "hidden",
	borderStyle: "solid",
	borderColor: BORDER_COLOR,
	borderTopWidth: BORDER_WIDTH,
	borderLeftWidth: 0,
	borderRightWidth: 0,
	borderBottomWidth: 0,
} as const;

const baseCellStyle = {
	borderRadius: 0,
	borderColor: BORDER_COLOR,
} as const;

// Reusable Components
interface WeekNumberSidebarProps {
	weekNumber: string;
	width: "$4" | "$6";
	borderTopWidth?: number;
	borderBottomWidth?: number;
	padding?: "$2";
}

function WeekNumberSidebar({
	weekNumber,
	width,
	borderTopWidth = 0,
	borderBottomWidth = 0,
	padding = "$2",
}: WeekNumberSidebarProps) {
	return (
		<Card
			width={width}
			bg="$color1"
			style={{
				...baseCellStyle,
				borderTopWidth,
				borderBottomWidth,
			}}
		>
			<Card.Header p={padding}>
				<Text fontWeight="bold" style={{ textAlign: "center" }}>
					{weekNumber}
				</Text>
			</Card.Header>
		</Card>
	);
}

interface HourLabelProps {
	hour: number;
	locale: Intl.LocalesArgument;
	hour12: boolean;
	sidebarWidth: "$4" | "$6";
}

function HourLabel({ hour, locale, hour12, sidebarWidth }: HourLabelProps) {
	const formattedTime = hour12
		? Intl.DateTimeFormat(locale, { hour: "numeric", hour12: true }).format(
				new Date(0, 0, 0, hour),
			)
		: Intl.DateTimeFormat(locale, {
				hour: "2-digit",
				minute: "2-digit",
				hour12: false,
			}).format(new Date(0, 0, 0, hour));

	return (
		<Card
			width={sidebarWidth}
			bg="$color1"
			justify="center"
			style={{
				...baseCellStyle,
				transform: [{ translateY: "-50%" }],
			}}
		>
			<Text
				fontWeight="bold"
				color="$color11"
				style={{
					width: "100%",
					userSelect: "none",
					textAlign: "end",
					position: "relative",
					right: "calc(var(--scrollbar-width) / 2)",
					visibility: hour === 0 ? "hidden" : "visible",
				}}
			>
				{formattedTime}
			</Text>
		</Card>
	);
}

interface HourGridProps {
	columnCount: number;
	hour: number;
	dates: Date[];
	positionedEntriesByDate: Map<string, PositionedEntry[]>;
}

function HourGridCells({
	columnCount,
	hour,
	dates,
	positionedEntriesByDate,
}: HourGridProps) {
	return (
		<>
			{[...Array(columnCount).keys()].map((_, i) => (
				<CalendarEntryHourView
					i={i}
					columnCount={columnCount}
					hour={hour}
					positionedEntries={
						positionedEntriesByDate.get(dates[i].toDateString()) ??
						[]
					}
					key={i}
				/>
			))}
		</>
	);
}

interface HourlyScrollViewProps {
	locale: Intl.LocalesArgument;
	hour12: boolean;
	sidebarWidth: "$4" | "$6";
	columnCount: number;
	dates: Date[];
}

function HourlyScrollView({
	locale,
	hour12,
	sidebarWidth,
	columnCount,
	dates,
}: HourlyScrollViewProps) {
	const myCalendars = useCalendars();
	const calendarEntries = useCalendarEntries(myCalendars);
	const { checkedCalendarIds } = useCalendarStore();

	// Compute positionedEntries once per date
	const positionedEntriesByDate = useMemo(() => {
		const map = new Map<string, PositionedEntry[]>();
		dates.forEach((date) => {
			const dayEntries =
				calendarEntries.data?.filter(
					(d) =>
						new Date(d.startDate!).toDateString() ===
							date.toDateString() &&
						d.calendarId &&
						checkedCalendarIds.includes(d.calendarId) &&
						!d.isAllDay,
				) ?? [];
			map.set(date.toDateString(), getPositionedEntries(dayEntries));
		});
		return map;
	}, [calendarEntries.data, dates, checkedCalendarIds]);
	return (
		<ScrollView flex={1} flexBasis={0}>
			<YStack>
				{[...Array(HOURS_IN_DAY).keys()].map((hour) => (
					<XStack
						key={hour}
						style={{ minHeight: "8vh", borderColor: BORDER_COLOR }}
					>
						<HourLabel
							hour={hour}
							locale={locale}
							hour12={hour12}
							sidebarWidth={sidebarWidth}
						/>
						<HourGridCells
							columnCount={columnCount}
							hour={hour}
							dates={dates}
							positionedEntriesByDate={positionedEntriesByDate}
						/>
					</XStack>
				))}
			</YStack>
		</ScrollView>
	);
}

interface CalendarProps {
	grid?: Record<string, CalendarCellProps[]>;
}

const ENTRY_HEIGHT = 25;
const HEADER_HEIGHT = 40;

interface CalendarRowProps {
	weekNumber: string;
	row: CalendarCellProps[];
	gap: "$1" | 0;
	sidebarWidth: "$4" | "$6";
	baseCellStyle: object;
	style?: React.CSSProperties;
}

function CalendarRow({
	weekNumber,
	row,
	gap,
	sidebarWidth,
	baseCellStyle,
	style,
}: CalendarRowProps) {
	const [entryCounts, setEntryCounts] = useState<number[]>(row.map(() => 0));

	const handleEntryCountChange = useCallback(
		(index: number, count: number) => {
			setEntryCounts((prev) => {
				const next = [...prev];
				next[index] = count;
				return next;
			});
		},
		[],
	);

	const maxEntries = Math.max(...entryCounts, 0);
	const rowMinHeight = HEADER_HEIGHT + maxEntries * ENTRY_HEIGHT;

	return (
		<XStack gap={gap} style={style}>
			<WeekNumberSidebar
				weekNumber={weekNumber}
				width={sidebarWidth}
				borderTopWidth={BORDER_WIDTH}
			/>

			{row.map((cell, i) => (
				<CalendarCell
					key={i}
					cell={cell}
					visibleCount={Infinity}
					onEntryCountChange={(count) =>
						handleEntryCountChange(i, count)
					}
					style={{
						...baseCellStyle,
						borderLeftWidth: BORDER_WIDTH,
						borderTopWidth: BORDER_WIDTH,
						borderBottomWidth: BORDER_WIDTH,
						borderRightWidth:
							i === row.length - 1 ? BORDER_WIDTH : 0,
						minHeight: rowMinHeight,
					}}
				/>
			))}
		</XStack>
	);
}

function AddEntryButton() {
	const { setContent } = useDialogStore();
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	return (
		<CustomDialog
			isDialogOpen={isDialogOpen}
			setIsDialogOpen={setIsDialogOpen}
			onPointerDownOutside={(e) => e.preventDefault()}
			content={
				<CreateCalendarEntryForm
					onClose={() => setIsDialogOpen(false)}
				/>
			}
		>
			<Dialog.Trigger asChild>
				<StyledButton
					style={{
						position: "absolute",
						bottom: 20,
						right: 20,
						zIndex: 100,
					}}
					circular
					scaleIcon={1.25}
					size={60}
					icon={Plus}
					onPress={() => {
						setContent(
							<CreateCalendarEntryForm isContextMenu={false} />,
						);
					}}
				></StyledButton>
			</Dialog.Trigger>
		</CustomDialog>
	);
}

export function Calendar({ grid }: CalendarProps) {
	const { selectedDate, viewType, mobileView, tabletView } =
		useCalendarStore();
	const { locale, weekStartsOn, hour12 } = useProfileStore();
	const media = useMedia();

	// Platform-specific styling
	const gap = isNative() ? "$1" : 0;
	const sidebarWidth = isNative() ? "$4" : "$6";

	// Memoized grid generation
	const calendarGrid = useMemo(
		() =>
			grid ??
			generateGrid({
				selectedDate,
				weekStartsOn,
				viewType,
			}),
		[grid, selectedDate, weekStartsOn, viewType],
	);

	const gridEntries = Object.entries(calendarGrid);
	const isWeekOrDayView = viewType === "week" || viewType === "day";

	// Weekday header
	const WeekdayHeader = useMemo(() => {
		let length;
		if (mobileView || isNative()) {
			length = "narrow";
		} else if (tabletView) {
			length = "short";
		} else {
			length = "long";
		}
		const weekdayLabels = Week.getWeekdayLabels(
			locale,
			length as Intl.DateTimeFormatOptions["weekday"],
			weekStartsOn,
		);

		return (
			<XStack width="100%">
				{(!mobileView || viewType === "week") && (
					<Card
						width={sidebarWidth}
						bg="$color1"
						style={baseCellStyle}
					/>
				)}

				{weekdayLabels.map((day, i) => (
					<Card
						key={i}
						py="$2"
						flex={1}
						flexBasis={0}
						bg="$color1"
						style={{
							...baseCellStyle,
							textAlign: "center",
							textTransform: "capitalize",
							borderBottomWidth: 0,
							borderLeftWidth: BORDER_WIDTH,
							borderRightWidth:
								i === weekdayLabels.length - 1 &&
								isWeekOrDayView
									? BORDER_WIDTH
									: 0,
						}}
					>
						<Text fontWeight="bold" style={{ textAlign: "center" }}>
							{day}
						</Text>
					</Card>
				))}
			</XStack>
		);
	}, [
		locale,
		weekStartsOn,
		viewType,
		media.xl,
		sidebarWidth,
		isWeekOrDayView,
		mobileView,
		tabletView,
	]);

	// Month/Multiweek View
	if (viewType === "month" || viewType === "multiweek") {
		return (
			<YStack style={containerStyle} bg="$color1" flex={1} width="100%">
				<AddEntryButton />
				{WeekdayHeader}
				<YStack flex={1} gap={gap} flexBasis={0}>
					{gridEntries.map(([weekNumber, row], rowIndex) => (
						<XStack gap={gap} flex={1} flexBasis={0} key={rowIndex}>
							{!mobileView && (
								<WeekNumberSidebar
									weekNumber={weekNumber}
									width={sidebarWidth}
									borderTopWidth={BORDER_WIDTH}
								/>
							)}

							{row.map((cell, i) => {
								return (
									<CalendarCell
										key={i}
										cell={cell}
										style={{
											...baseCellStyle,
											borderLeftWidth: BORDER_WIDTH,
											borderTopWidth: BORDER_WIDTH,
										}}
									/>
								);
							})}
						</XStack>
					))}
				</YStack>
			</YStack>
		);
	}

	// Week View
	if (viewType === "week") {
		return (
			<YStack style={containerStyle} bg="$color1" flex={1} width="100%">
				<AddEntryButton />
				<XStack style={{ marginRight: "var(--scrollbar-width)" }}>
					{WeekdayHeader}
				</XStack>

				{gridEntries.map(([weekNumber, row], rowIndex) => (
					<CalendarRow
						key={rowIndex}
						weekNumber={weekNumber}
						row={row}
						gap={gap}
						sidebarWidth={sidebarWidth}
						baseCellStyle={baseCellStyle}
						style={{ marginRight: "var(--scrollbar-width)" }}
					/>
				))}
				<HourlyScrollView
					locale={locale}
					hour12={hour12}
					sidebarWidth={sidebarWidth}
					columnCount={DAYS_IN_WEEK}
					dates={gridEntries[0][1].map((cell) => cell.date)}
				/>
			</YStack>
		);
	}

	// Day View
	if (viewType === "day") {
		return (
			<YStack style={containerStyle} bg="$color1" flex={1} width="100%">
				<AddEntryButton />
				{gridEntries.map(([weekNumber, row], rowIndex) => (
					<XStack
						key={rowIndex}
						style={{
							marginRight: "var(--scrollbar-width)",
							height: "fit-content",
						}}
					>
						<WeekNumberSidebar
							weekNumber={weekNumber}
							width={sidebarWidth}
							borderBottomWidth={BORDER_WIDTH}
						/>
						{row.map((cell, i) => {
							return (
								<CalendarCell
									key={i}
									cell={cell}
									style={{
										...baseCellStyle,
										maxHeight: "fit-content",
										borderLeftWidth: BORDER_WIDTH,
										borderBottomWidth:
											rowIndex === gridEntries.length - 1
												? BORDER_WIDTH
												: 0,
										borderRightWidth:
											i === row.length - 1
												? BORDER_WIDTH
												: 0,
									}}
								/>
							);
						})}
					</XStack>
				))}
				<HourlyScrollView
					locale={locale}
					hour12={hour12}
					sidebarWidth={sidebarWidth}
					columnCount={1}
					dates={[gridEntries[0][1][0].date]}
				/>
			</YStack>
		);
	}

	return null;
}
