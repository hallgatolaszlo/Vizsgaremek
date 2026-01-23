import { components } from "@repo/types";
import { api } from "./api";

type GetCalendarEntryDto = components["schemas"]["GetCalendarEntryDTO"];
type CreateCalendarEntryDTO = components["schemas"]["CreateCalendarEntryDTO"];
type UpdateCalendarEntryDTO = components["schemas"]["UpdateCalendarEntryDTO"];

export async function getCalendarEntry(id: string) {
    const response = await api.get(`api/CalendarEntry/${id}`);
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
