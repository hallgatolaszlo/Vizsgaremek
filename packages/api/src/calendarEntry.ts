import { components } from "@repo/types";
import { api } from "./api";

type GetCalendarEntryDTO = components["schemas"]["GetCalendarEntryDTO"];
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
    const response = await api.get<GetCalendarEntryDTO>(
        `api/CalendarEntry/${id}`,
        {
            params: {
                startDate: options?.startDate,
                endDate: options?.endDate,
            },
        },
    );
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
        `api/CalendarEntry/${request.id}`,
        request,
    );
    return response.data;
}

export async function deleteCalendarEntry(id: string) {
    const response = await api.delete(`api/CalendarEntry/${id}`);
    return response.data;
}
