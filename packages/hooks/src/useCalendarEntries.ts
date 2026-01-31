import { getCalendarEntry } from "@repo/api";
import { components } from "@repo/types";
import { QueryClient, useQuery, UseQueryResult } from "@tanstack/react-query";

type getCalendarDTO = components["schemas"]["GetCalendarDTO"];
type getCalendarEntryDTO = components["schemas"]["GetCalendarEntryDTO"];

export const useCalendarEntries = (
	queryClient: QueryClient,
	myCalendarsQuery: UseQueryResult<getCalendarDTO[]>,
) =>
	useQuery<getCalendarEntryDTO[]>({
		queryKey: ["calendarEntries", myCalendarsQuery.data],
		queryFn: async () => {
			const calendarIds =
				myCalendarsQuery.data?.map((cal) => cal.id) || [];
			const entriesPromises = calendarIds.map(async (id) => {
				const response = await getCalendarEntry(id!);
				return response;
			});
			const results = await Promise.all(entriesPromises);
			return results.flat(); // Flatten array of arrays into single array
		},
		enabled: !!myCalendarsQuery.data,
	});
