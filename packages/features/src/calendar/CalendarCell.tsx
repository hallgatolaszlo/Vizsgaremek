import {
	useCalendarEntries,
	useCalendars,
	useCalendarStore,
	useContextMenuStore,
	useProfileStore,
} from "@repo/hooks";
import { CalendarCellProps } from "@repo/types";
import { isNative } from "@repo/utils";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, Card, CardProps, Text } from "tamagui";
import { CalendarEntry } from "./CalendarEntry";

interface CalendarCellComponentProps extends CardProps {
	cell: CalendarCellProps;
	visibleCount?: number;
	onEntryCountChange?: (count: number) => void;
}

export default function CalendarCell(props: CalendarCellComponentProps) {
	const {
		selectedDate,
		viewType,
		setSelectedDate,
		currentDate,
		checkedCalendarIds,
		tabletView,
		mobileView,
	} = useCalendarStore();
	const { locale } = useProfileStore();
	const { setFieldType, setDate } = useContextMenuStore();

	const {
		cell,
		visibleCount: externalVisibleCount,
		onEntryCountChange,
	} = props;

	const myCalendars = useCalendars();
	const calendarEntries = useCalendarEntries(myCalendars);

	const cardRef = useRef<HTMLDivElement>(null);
	const headRef = useRef<HTMLDivElement>(null);
	const [visibleCount, setVisibleCount] = useState<number>(Infinity);

	const ENTRY_HEIGHT = 25;

	useEffect(() => {
		const element = cardRef.current;
		if (!element) return;

		const handleContextMenu = (e: MouseEvent) => {
			e.preventDefault();
			e.stopPropagation();

			setFieldType("cell");
			setDate(new Date(cell.date));
		};

		element.addEventListener("contextmenu", handleContextMenu);
		return () => {
			element.removeEventListener("contextmenu", handleContextMenu);
		};
	}, [cell.date, setFieldType, setDate]);

	// Determine header label to show
	const headerLabel = () => {
		// Native: just show the date number
		if (isNative()) {
			return cell.date.getDate();
		}

		if (viewType === "day") {
			// Day view: show full weekday name, month name, date number
			return cell.date.toLocaleDateString(locale, {
				weekday: "long",
				month: "long",
				day: "numeric",
			});
		}

		if (viewType === "week") {
			// Multiweek view: show abbreviated weekday name and date number
			return cell.date.toLocaleDateString(locale, {
				month: "short",
				day: "numeric",
			});
		}

		// Web: show month abbreviation if first of month...
		if (cell.date.getDate() === 1 && !tabletView && !mobileView) {
			return cell.date.toLocaleDateString(locale, {
				month: "short",
				day: "numeric",
			});
		}

		// ... or last of month
		const date = new Date(cell.date);
		date.setDate(date.getDate() + 1);
		if (
			date.getMonth() !== cell.date.getMonth() &&
			!tabletView &&
			!mobileView
		) {
			return cell.date.toLocaleDateString(locale, {
				month: "short",
				day: "numeric",
			});
		}

		// Otherwise, just show the date number
		return cell.date.toLocaleDateString(locale, { day: "numeric" });
	};

	function decideStyling(cell: CalendarCellProps): CardProps {
		// Selected date styling
		if (cell.date.toDateString() === selectedDate.toDateString()) {
			return {
				bg: "$accent3",
				outlineWidth: 2,
				outlineOffset: -2,
				outlineColor: "$accent9",
				outlineStyle: "solid",
				position: "relative",
				zIndex: 500,
			} as CardProps;
		}
		// Current date styling
		if (cell.date.toDateString() === currentDate.toDateString()) {
			return { bg: "$accent1" } as CardProps;
		}
		// Out-of-month styling for month view
		if (viewType === "month" && !cell.inCurrentMonth) {
			return { bg: "$color2" } as CardProps;
		}
		// Default styling
		return { bg: "$color1" } as CardProps;
	}

	const filteredEntries = calendarEntries.data?.filter(
		(d) =>
			new Date(d.startDate!).toDateString() ===
				cell.date.toDateString() &&
			d.calendarId &&
			checkedCalendarIds.includes(d.calendarId),
	);

	useEffect(() => {
		if (viewType != "month" && viewType != "multiweek") return;
		if (onEntryCountChange) {
			onEntryCountChange(filteredEntries?.length ?? 0);
		}
	}, [filteredEntries?.length]);

	useEffect(() => {
		if (viewType != "month" && viewType != "multiweek") return;
		if (externalVisibleCount !== undefined) return; // skip if controlled externally

		const cardElement = cardRef.current;
		if (!cardElement) return;

		const observer = new ResizeObserver(() => {
			const cardHeight = cardElement.clientHeight;
			const availableHeight = cardHeight - 40;

			const totalEntries = filteredEntries?.length ?? 0;
			const maxFit = Math.floor(availableHeight / ENTRY_HEIGHT);
			if (totalEntries <= maxFit) {
				setVisibleCount(totalEntries);
			} else {
				const fitWithIndicator = Math.floor(
					(availableHeight - ENTRY_HEIGHT) / ENTRY_HEIGHT,
				);
				setVisibleCount(fitWithIndicator >= 0 ? fitWithIndicator : 0);
			}
		});

		observer.observe(cardElement);
		return () => observer.disconnect();
	}, [filteredEntries?.length, externalVisibleCount]);

	const resolvedVisibleCount = externalVisibleCount ?? visibleCount;
	const visibleEntries =
		filteredEntries?.slice(0, resolvedVisibleCount) ?? [];
	const hiddenCount = (filteredEntries?.length ?? 0) - visibleEntries.length;

	return (
		<Card
			{...decideStyling(cell)}
			style={props.style}
			hoverStyle={{ backgroundColor: "var(--accent2)" }}
			flex={1}
			flexBasis={0}
			minW={0}
			onPress={() => setSelectedDate(new Date(cell.date))}
			ref={cardRef}
		>
			<Card.Header
				p="$2"
				style={{
					margin: 0,
					alignItems: "center",
				}}
				ref={headRef}
			>
				<Text
					fontWeight="$2"
					style={{
						userSelect: "none",
						textAlign: "center",
						textWrap: "none",
						wordBreak: "unset",
						wordWrap: "unset",
						overflowWrap: "unset",
						height: "fit-content",
						textTransform: "capitalize",
					}}
				>
					{headerLabel()}
				</Text>
			</Card.Header>
			<AnimatePresence>
				{visibleEntries.map((entry) => (
					<CalendarEntry key={entry.id} entry={entry} />
				))}
			</AnimatePresence>
			{hiddenCount > 0 && (
				<Text
					style={{
						userSelect: "none",
						height: "fit-content",
						paddingLeft: "10px",
						borderRadius: "10px",
					}}
					hoverStyle={{
						background: "grey",
						transition: "background 250ms ease",
					}}
					onPress={(e) => e.stopPropagation()}
				>
					{hiddenCount} more...
				</Text>
			)}
		</Card>
	);
}
