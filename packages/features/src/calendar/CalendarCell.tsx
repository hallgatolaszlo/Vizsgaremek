import CustomDialog from "@/src/components/CalendarPage/CustomDialog";
import {
	useCalendarEntries,
	useCalendars,
	useCalendarStore,
	useContextMenuStore,
	useProfileStore,
} from "@repo/hooks";
import { CalendarCellProps } from "@repo/types";
import { isNative } from "@repo/utils";
import { X } from "@tamagui/lucide-icons";
import { useEffect, useRef, useState } from "react";
import {
	AnimatePresence,
	Card,
	CardProps,
	Dialog,
	Text,
	XStack,
	YStack,
} from "tamagui";
import { CalendarEntry } from "./CalendarEntry";

interface CalendarCellComponentProps extends CardProps {
	cell: CalendarCellProps;
	visibleCount?: number;
	onEntryCountChange?: (count: number) => void;
	rowStartDate?: Date;
	rowEndDate?: Date;
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
	const { locale, weekStartsOn } = useProfileStore();
	const { setFieldType, setDate } = useContextMenuStore();
	const [isDialogOpen, setIsDialogOpen] = useState(false);

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

	// Build filteredEntries. For month/multiweek views we construct a row-aware
	// list that includes ghost placeholders so spanning events occupy the same
	// vertical slot across all cells in the row.
	let filteredEntries = calendarEntries.data ?? [];

	if (viewType === "month" || viewType === "multiweek") {
		// Require row boundaries to build row-aware layout; fall back to per-cell
		// selection if they are not provided.
		if (props.rowStartDate && props.rowEndDate) {
			const rowStart = new Date(props.rowStartDate);
			rowStart.setHours(0, 0, 0, 0);
			const rowEnd = new Date(props.rowEndDate);
			rowEnd.setHours(0, 0, 0, 0);

			// Collect events that overlap the row and belong to checked calendars
			const rowEvents = (calendarEntries.data ?? []).filter((d) => {
				if (!d.calendarId || !checkedCalendarIds.includes(d.calendarId))
					return false;
				const s = new Date(d.startDate!);
				s.setHours(0, 0, 0, 0);
				const e = d.endDate ? new Date(d.endDate) : new Date(d.startDate!);
				e.setHours(0, 0, 0, 0);
				return e.getTime() >= rowStart.getTime() && s.getTime() <= rowEnd.getTime();
			});

			// Assign events into vertical slots across the row so each event has a
			// fixed slot index for the whole row. This prevents slot shifting and
			// only inserts ghosts where a slot is empty for this specific cell.
			rowEvents.sort((a, b) => {
				const aS = new Date(a.startDate!).setHours(0, 0, 0, 0);
				const bS = new Date(b.startDate!).setHours(0, 0, 0, 0);
				if (aS === bS) {
					const aLen = new Date(a.endDate ?? a.startDate!).getTime() - new Date(a.startDate!).getTime();
					const bLen = new Date(b.endDate ?? b.startDate!).getTime() - new Date(b.startDate!).getTime();
					return bLen - aLen;
				}
				return aS - bS;
			});

			const slots: any[][] = [];
			for (const ev of rowEvents) {
				const evS = new Date(ev.startDate!); evS.setHours(0,0,0,0);
				const evE = ev.endDate ? new Date(ev.endDate) : new Date(ev.startDate!); evE.setHours(0,0,0,0);
				let placed = false;
				for (const slot of slots) {
					// since slot events do not overlap, checking against the last is enough
					const last = slot[slot.length - 1];
					const lastE = last.endDate ? new Date(last.endDate) : new Date(last.startDate);
					lastE.setHours(0,0,0,0);
					if (lastE.getTime() < evS.getTime()) {
						slot.push(ev);
						placed = true;
						break;
					}
				}
				if (!placed) {
					slots.push([ev]);
				}
			}

			const cellDay = new Date(cell.date);
			cellDay.setHours(0, 0, 0, 0);

			// Build per-slot entry for this cell: real event if it covers the cell,
			// otherwise a ghost placeholder so vertical alignment is preserved.
			const rowAware: any[] = slots.map((slot) => {
				const evForCell = slot.find((ev) => {
					const s = new Date(ev.startDate!); s.setHours(0,0,0,0);
					const e = ev.endDate ? new Date(ev.endDate) : new Date(ev.startDate!); e.setHours(0,0,0,0);
					return cellDay.getTime() >= s.getTime() && cellDay.getTime() <= e.getTime();
				});
				if (evForCell) return evForCell;
				// ghost placeholder
				const representative = slot[0];
				return {
					id: `ghost-${representative.id}-${cellDay.toDateString()}`,
					name: "",
					startDate: representative.startDate,
					endDate: representative.endDate,
					calendarId: representative.calendarId,
					color: representative.color,
					isAllDay: true,
					_isGhost: true,
				} as any;
			});

			filteredEntries = rowAware;
		} else {
			// Fallback: per-cell selection if row boundaries not provided
			filteredEntries = (calendarEntries.data ?? []).filter((d) => {
				if (!d.calendarId || !checkedCalendarIds.includes(d.calendarId))
					return false;
				const s = new Date(d.startDate!); s.setHours(0, 0, 0, 0);
				const e = d.endDate ? new Date(d.endDate) : new Date(d.startDate!); e.setHours(0, 0, 0, 0);
				const cellDay = new Date(cell.date); cellDay.setHours(0,0,0,0);
				return cellDay.getTime() >= s.getTime() && cellDay.getTime() <= e.getTime();
			}).sort((a,b)=>{
				const aLen = (new Date(a.endDate ?? a.startDate!).getTime() - new Date(a.startDate!).getTime());
				const bLen = (new Date(b.endDate ?? b.startDate!).getTime() - new Date(b.startDate!).getTime());
				return bLen - aLen;
			});
		}
	} else if (viewType === "week" || viewType === "day") {
		filteredEntries = (calendarEntries.data ?? []).filter((d) => {
			if (!d.calendarId || !checkedCalendarIds.includes(d.calendarId))
				return false;
			return new Date(d.startDate!).toDateString() === cell.date.toDateString() && !!d.isAllDay;
		}).sort((a,b)=>{
			const aLen = (new Date(a.endDate ?? a.startDate!).getTime() - new Date(a.startDate!).getTime());
			const bLen = (new Date(b.endDate ?? b.startDate!).getTime() - new Date(b.startDate!).getTime());
			return bLen - aLen;
		});
	} else {
		filteredEntries = (calendarEntries.data ?? []).filter((d) => new Date(d.startDate!).toDateString() === cell.date.toDateString()).sort((a,b)=>{
			const aLen = (new Date(a.endDate ?? a.startDate!).getTime() - new Date(a.startDate!).getTime());
			const bLen = (new Date(b.endDate ?? b.startDate!).getTime() - new Date(b.startDate!).getTime());
			return bLen - aLen;
		});
	}

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
	const visibleEntries = filteredEntries?.slice(0, resolvedVisibleCount) ?? [];
	const visibleRealCount = visibleEntries.filter((e) => !(e as any)?._isGhost).length;
	const totalReal = filteredEntries.filter((e) => !(e as any)?._isGhost).length;
	const hiddenCount = Math.max(totalReal - visibleRealCount, 0);

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
					fontWeight="bold"
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
				{visibleEntries.map((entry) => {
					const s = new Date(entry.startDate!);
					const e = entry.endDate
						? new Date(entry.endDate)
						: new Date(entry.startDate!);
					const cellDay = new Date(cell.date);
					cellDay.setHours(0, 0, 0, 0);
					const sDay = new Date(s);
					sDay.setHours(0, 0, 0, 0);
					const eDay = new Date(e);
					eDay.setHours(0, 0, 0, 0);
					const isMultiDay = eDay.getTime() > sDay.getTime();
					const isStart = sDay.getTime() === cellDay.getTime();
					let isEnd = eDay.getTime() === cellDay.getTime();

					// If this is month/multiweek view and the event ends after the end of
					// the current week row, consider the last cell of the row its visual
					// "end" so the tail appears in the same row as the head.
					if (!isEnd && (viewType === "month" || viewType === "multiweek")) {
						if (props.rowEndDate) {
							const rowEnd = new Date(props.rowEndDate);
							rowEnd.setHours(0, 0, 0, 0);
							if (eDay.getTime() > rowEnd.getTime() && cellDay.getTime() === rowEnd.getTime()) {
								isEnd = true;
							}
						}
					}

					// Determine whether to show text for multi-day entries.
					// Show text when the entry starts here, or when this cell is the
					// first visible cell of the row for the event (row start), or
					// when the previous day is not part of the event span.
					const prevDay = new Date(cell.date);
					prevDay.setDate(prevDay.getDate() - 1);
					prevDay.setHours(0, 0, 0, 0);
					const prevInSpan =
						prevDay.getTime() >= sDay.getTime() &&
						prevDay.getTime() <= eDay.getTime();
					const weekStartIndex = weekStartsOn === "sunday" ? 0 : 1;
					const cellIsRowStart =
						cell.date.getDay() === weekStartIndex;
					const rowEndIndex = (weekStartIndex + 6) % 7;
					const cellIsRowEnd = cell.date.getDay() === rowEndIndex;
					const showText = isStart || !prevInSpan || cellIsRowStart;

					return (
						<CalendarEntry
							key={entry.id}
							entry={entry}
							isMultiDay={isMultiDay}
							isStart={isStart}
							isEnd={isEnd}
							showText={showText}
							isRowStart={cellIsRowStart}
							isRowEnd={cellIsRowEnd}
							isGhost={(entry as any)?._isGhost}
						/>
					);
				})}
			</AnimatePresence>
			{hiddenCount > 0 && (
				<CustomDialog
					isDialogOpen={isDialogOpen}
					setIsDialogOpen={setIsDialogOpen}
					content={
						<YStack minW={"15vw"}>
							<XStack
								ml={10}
								cursor="pointer"
								onPress={(e) => {
									e.stopPropagation();
									setIsDialogOpen(false);
								}}
								style={{
									right: 0,
									position: "absolute",
								}}
							>
								<X />
							</XStack>
							<Text
								fontWeight="bold"
								style={{
									userSelect: "none",
									textAlign: "center",
									textWrap: "none",
									wordBreak: "unset",
									wordWrap: "unset",
									overflowWrap: "unset",
									textTransform: "capitalize",
									fontSize: "1.25rem",
									marginBottom: "15px",
								}}
							>
								{headerLabel()}
							</Text>
							{filteredEntries
								?.filter((e) => !(e as any)?._isGhost)
								.map((entry) => (
									<CalendarEntry key={entry.id} entry={entry} />
								))}
						</YStack>
					}
					transparent={true}
				>
					<Dialog.Trigger asChild>
						<Text
							style={{
								userSelect: "none",
								height: "fit-content",
								paddingLeft: "10px",
								borderRadius: "10px",
								cursor: "pointer",
							}}
							hoverStyle={{
								background: "grey",
								transition: "background 250ms ease",
							}}
							onPress={(e) => e.stopPropagation()}
						>
							{hiddenCount} more...
						</Text>
					</Dialog.Trigger>
				</CustomDialog>
			)}
		</Card>
	);
}
