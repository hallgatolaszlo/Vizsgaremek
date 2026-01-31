import { getCalendar } from "@repo/api";
import { components } from "@repo/types";
import { QueryClient, useQuery } from "@tanstack/react-query";

type getCalendarDTO = components["schemas"]["GetCalendarDTO"];

export const useCalendars = (queryClient: QueryClient) =>
	useQuery<getCalendarDTO[]>({
		queryKey: ["myCalendars"],
		queryFn: async () => {
			const calendars = await getCalendar();
			queryClient.invalidateQueries({ queryKey: ["calendarEntries"] });
			return calendars;
		},
	});
