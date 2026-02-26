import { CalendarEntry } from "@repo/features";
import { useEffect, useRef, useState } from "react";
import { Card, View } from "tamagui";
import { PositionedEntry } from "./calendarEntryUtils";

const BORDER_COLOR = "var(--color5)";
const BORDER_WIDTH = 1;

interface HourGridProps {
    i: number;
    columnCount: number;
    hour: number;
    date: Date;
    positionedEntries: PositionedEntry[]; // Receive from parent
}

export function CalendarEntryHourView({
    i,
    columnCount,
    hour,
    date,
    positionedEntries,
}: HourGridProps) {
    const baseCellStyle = {
        borderRadius: 0,
        borderColor: BORDER_COLOR,
    } as const;

    const cardRef = useRef<HTMLDivElement>(null);
    const [cellHeight, setCellHeight] = useState(0);

    useEffect(() => {
        if (cardRef.current) {
            setCellHeight(cardRef.current.clientHeight);
        }
    }, []);

    // Only render entries that START in this hour
    const entriesForThisHour = positionedEntries.filter(
        ({ entry }) => new Date(entry.startDate!).getHours() === hour,
    );

    const calculateEntryHeight = (entry: PositionedEntry["entry"]): number => {
        const startDate = new Date(entry.startDate!);
        const endDate = new Date(entry.endDate!);
        const durationMinutes =
            (endDate.getTime() - startDate.getTime()) / 60000;
        return (durationMinutes / 60) * cellHeight;
    };

    const calculateTopOffset = (entry: PositionedEntry["entry"]): number => {
        const minutesIntoHour = new Date(entry.startDate!).getMinutes();
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
                overflow: "visible",
            }}
        >
            {entriesForThisHour.map(({ entry, column, totalColumns }) => (
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
