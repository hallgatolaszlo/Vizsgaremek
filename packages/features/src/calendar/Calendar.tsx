import { useCalendarStore, useProfileStore } from "@repo/hooks";
import { CalendarCellProps } from "@repo/types";
import { generateGrid, isNative, Week } from "@repo/utils";
import { useMemo } from "react";
import { Card, ScrollView, Text, useMedia, XStack, YStack } from "tamagui";
import CalendarCell from "./CalendarCell";

// Constants
const BORDER_WIDTH = 1;
const BORDER_COLOR = "var(--color5)";
const HOURS_IN_DAY = 24;
const DAYS_IN_WEEK = 7;

// Common styles
const containerStyle = {
    margin: "10px",
    borderRadius: "15px",
    overflow: "hidden",
    border: `1px solid ${BORDER_COLOR}`,
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
                <Text fontWeight="$2" style={{ textAlign: "center" }}>
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
                fontWeight="$2"
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
}

function HourGridCells({ columnCount, hour }: HourGridProps) {
    return (
        <>
            {[...Array(columnCount).keys()].map((_, i) => (
                <Card
                    key={i}
                    flex={1}
                    flexBasis={0}
                    bg="$color1"
                    style={{
                        ...baseCellStyle,
                        borderLeftWidth: BORDER_WIDTH,
                        borderTopWidth: hour === 0 ? 0 : BORDER_WIDTH,
                        borderRightWidth:
                            i === columnCount - 1 ? BORDER_WIDTH : 0,
                    }}
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
}

function HourlyScrollView({
    locale,
    hour12,
    sidebarWidth,
    columnCount,
}: HourlyScrollViewProps) {
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
                        <HourGridCells columnCount={columnCount} hour={hour} />
                    </XStack>
                ))}
            </YStack>
        </ScrollView>
    );
}

interface CalendarProps {
    grid?: Record<string, CalendarCellProps[]>;
}

export function Calendar({ grid }: CalendarProps) {
    const { selectedDate, viewType } = useCalendarStore();
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
        const weekdayLabels = isNative()
            ? Week.getWeekdayLabels(locale, "narrow", weekStartsOn)
            : Week.getWeekdayLabels(
                  locale,
                  media.xl ? "long" : "short",
                  weekStartsOn,
              );

        return (
            <XStack width="100%">
                <Card width={sidebarWidth} bg="$color1" style={baseCellStyle} />
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
                        <Text fontWeight="$2" style={{ textAlign: "center" }}>
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
    ]);

    // Month/Multiweek View
    if (viewType === "month" || viewType === "multiweek") {
        return (
            <YStack style={containerStyle} bg="$color1" flex={1} width="100%">
                {WeekdayHeader}
                <YStack flex={1} gap={gap} flexBasis={0}>
                    {gridEntries.map(([weekNumber, row], rowIndex) => (
                        <XStack gap={gap} flex={1} flexBasis={0} key={rowIndex}>
                            <WeekNumberSidebar
                                weekNumber={weekNumber}
                                width={sidebarWidth}
                                borderTopWidth={BORDER_WIDTH}
                            />
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
                <XStack style={{ marginRight: "var(--scrollbar-width)" }}>
                    {WeekdayHeader}
                </XStack>
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
                            borderTopWidth={BORDER_WIDTH}
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
                                        borderTopWidth: BORDER_WIDTH,
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
                    columnCount={DAYS_IN_WEEK}
                />
            </YStack>
        );
    }

    // Day View
    if (viewType === "day") {
        return (
            <YStack style={containerStyle} bg="$color1" flex={1} width="100%">
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
                />
            </YStack>
        );
    }

    return null;
}
