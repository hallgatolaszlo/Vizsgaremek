import { CalendarEntry } from "@repo/features";
import {
    useCalendarEntries,
    useCalendars,
    useCalendarStore,
} from "@repo/hooks";
import { components } from "@repo/types";
import { useEffect, useMemo, useRef, useState } from "react";
import { Card, View } from "tamagui";

const BORDER_COLOR = "var(--color5)";
const BORDER_WIDTH = 1;

interface HourGridProps {
    i: number;
    columnCount: number;
    hour: number;
    date: Date;
}

type GetCalendarEntryDTO = components["schemas"]["GetCalendarEntryDTO"];

interface PositionedEntry {
    entry: GetCalendarEntryDTO;
    column: number;
    totalColumns: number;
}

function getOverlappingGroups(
    entries: GetCalendarEntryDTO[],
): PositionedEntry[] {
    if (!entries.length) return [];

    // Sort by start time
    const sorted = [...entries].sort(
        (a, b) =>
            new Date(a.startDate!).getTime() - new Date(b.startDate!).getTime(),
    );

    const result: PositionedEntry[] = [];

    // Group overlapping entries
    let currentGroup: GetCalendarEntryDTO[] = [];
    let groupEnd = 0;

    for (const entry of sorted) {
        const start = new Date(entry.startDate!).getTime();
        const end = new Date(entry.endDate!).getTime();

        if (currentGroup.length === 0 || start < groupEnd) {
            // Overlaps with current group
            currentGroup.push(entry);
            groupEnd = Math.max(groupEnd, end);
        } else {
            // No overlap, process current group and start new one
            assignColumns(currentGroup, result);
            currentGroup = [entry];
            groupEnd = end;
        }
    }

    // Process last group
    if (currentGroup.length > 0) {
        assignColumns(currentGroup, result);
    }

    return result;
}

function assignColumns(
    group: GetCalendarEntryDTO[],
    result: PositionedEntry[],
) {
    const totalColumns = group.length;
    group.forEach((entry, index) => {
        result.push({
            entry,
            column: index,
            totalColumns,
        });
    });
}

export function CalendarEntryHourView({
    i,
    columnCount,
    hour,
    date,
}: HourGridProps) {
    const baseCellStyle = {
        borderRadius: 0,
        borderColor: BORDER_COLOR,
    } as const;

    const myCalendars = useCalendars();
    const calendarEntries = useCalendarEntries(myCalendars);
    const { checkedCalendarIds } = useCalendarStore();

    const filteredEntries = useMemo(
        () =>
            calendarEntries.data?.filter(
                (d) =>
                    new Date(d.startDate!).toDateString() ===
                        date.toDateString() &&
                    hour === new Date(d.startDate!).getHours() &&
                    d.calendarId &&
                    checkedCalendarIds.includes(d.calendarId) &&
                    !d.isAllDay,
            ) ?? [],
        [calendarEntries.data, date, hour, checkedCalendarIds],
    );

    const positionedEntries = useMemo(
        () => getOverlappingGroups(filteredEntries),
        [filteredEntries],
    );

    const cardRef = useRef<HTMLDivElement>(null);
    const [cellHeight, setCellHeight] = useState(0);

    useEffect(() => {
        if (cardRef.current) {
            setCellHeight(cardRef.current.clientHeight);
        }
    }, []);

    const calculateEntryHeight = (entry: GetCalendarEntryDTO): number => {
        const startDate = new Date(entry.startDate!);
        const endDate = new Date(entry.endDate!);

        const startMinutes = startDate.getHours() * 60 + startDate.getMinutes();
        const endMinutes = endDate.getHours() * 60 + endDate.getMinutes();
        const durationMinutes = endMinutes - startMinutes;
        const durationHours = durationMinutes / 60;

        return durationHours * cellHeight;
    };

    const calculateTopOffset = (entry: GetCalendarEntryDTO): number => {
        const startDate = new Date(entry.startDate!);
        const minutesIntoHour = startDate.getMinutes();
        return (minutesIntoHour / 60) * cellHeight;
    };

    return (
        <Card
            ref={cardRef}
            flex={1}
            flexBasis={0}
            bg="$color1"
            style={{
                ...baseCellStyle,
                borderLeftWidth: BORDER_WIDTH,
                borderTopWidth: hour === 0 ? 0 : BORDER_WIDTH,
                borderRightWidth: i === columnCount - 1 ? BORDER_WIDTH : 0,
                minHeight: "50px",
                position: "relative",
            }}
        >
            {positionedEntries.map(({ entry, column, totalColumns }) => (
                <View
                    key={entry.id}
                    style={{
                        position: "absolute",
                        top: calculateTopOffset(entry),
                        left: `${(column / totalColumns) * 100}%`,
                        width: `${100 / totalColumns}%`,
                        height: calculateEntryHeight(entry),
                        zIndex: 1,
                    }}
                >
                    <CalendarEntry
                        entry={entry}
                        height="100%"
                        marginTop="0px"
                    />
                </View>
            ))}
        </Card>
    );
}
