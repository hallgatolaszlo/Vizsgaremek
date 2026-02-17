import { getCalendar } from "@repo/api";
import { components } from "@repo/types";
import { useQuery } from "@tanstack/react-query";

type getCalendarDTO = components["schemas"]["GetCalendarDTO"];

export const useCalendars = () =>
	useQuery<getCalendarDTO[]>({
		queryKey: ["myCalendars"],
		queryFn: async () => {
			const calendars = await getCalendar();
			return calendars;
		},
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
