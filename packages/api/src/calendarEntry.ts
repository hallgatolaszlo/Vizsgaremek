import { components } from "@repo/types";
import { api } from "./api";

interface GetCalendarEntryOptions {
    startDate?: string;
    endDate?: string;
}

type CreateCalendarEntryDTO = components["schemas"]["CreateCalendarEntryDTO"];
type UpdateCalendarEntryDTO = components["schemas"]["UpdateCalendarEntryDTO"];

export async function getCalendarEntry(
    id: string,
    options?: GetCalendarEntryOptions,
) {
    const response = await api.get(`api/CalendarEntry/${id}`, {
        params: { startDate: options?.startDate, endDate: options?.endDate },
    });
    return response.data;
}

export async function createCalendarEntry(request: CreateCalendarEntryDTO) {
    const response = await api.post<CreateCalendarEntryDTO>(
        "api/CalendarEntry",
        request,
    );
    return response.data;
}

export async function updateCalendarEntry(request: UpdateCalendarEntryDTO) {
    const response = await api.put<UpdateCalendarEntryDTO>(
        "api/CalendarEntry",
        request,
    );
    return response.data;
}
