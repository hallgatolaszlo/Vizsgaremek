import { getCalendarEntry } from "@repo/api";
import { components } from "@repo/types";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

type getCalendarDTO = components["schemas"]["GetCalendarDTO"];
type getCalendarEntryDTO = components["schemas"]["GetCalendarEntryDTO"];

export const useCalendarEntries = (
	myCalendarsQuery: UseQueryResult<getCalendarDTO[]>,
) =>
	useQuery<getCalendarEntryDTO[]>({
		queryKey: ["calendarEntries", myCalendarsQuery.data?.map((c) => c.id)],
		queryFn: async () => {
			const calendarIds =
				myCalendarsQuery.data?.map((cal) => cal.id) || [];
			const entriesPromises = calendarIds.map(async (id) => {
				const response = await getCalendarEntry(id!);
				return response;
			});
			const results = await Promise.all(entriesPromises);
			return results.flat();
		},
		enabled: !!myCalendarsQuery.data,
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
