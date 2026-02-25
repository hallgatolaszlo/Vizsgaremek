import { components } from "@repo/types";

type GetCalendarEntryDTO = components["schemas"]["GetCalendarEntryDTO"];

export interface PositionedEntry {
    entry: GetCalendarEntryDTO;
    column: number;
    totalColumns: number;
}

function assignColumns(
    group: GetCalendarEntryDTO[],
    result: PositionedEntry[],
) {
    const totalColumns = group.length;
    group.forEach((entry, index) => {
        result.push({ entry, column: index, totalColumns });
    });
}

export function getPositionedEntries(
    entries: GetCalendarEntryDTO[],
): PositionedEntry[] {
    if (!entries.length) return [];

    const sorted = [...entries].sort(
        (a, b) =>
            new Date(a.startDate!).getTime() - new Date(b.startDate!).getTime(),
    );

    const result: PositionedEntry[] = [];
    let currentGroup: GetCalendarEntryDTO[] = [];
    let groupEnd = 0;

    for (const entry of sorted) {
        const start = new Date(entry.startDate!).getTime();
        const end = new Date(entry.endDate!).getTime();

        if (currentGroup.length === 0 || start < groupEnd) {
            currentGroup.push(entry);
            groupEnd = Math.max(groupEnd, end);
        } else {
            assignColumns(currentGroup, result);
            currentGroup = [entry];
            groupEnd = end;
        }
    }

    if (currentGroup.length > 0) {
        assignColumns(currentGroup, result);
    }

    return result;
}
