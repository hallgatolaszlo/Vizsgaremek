import { components } from "@repo/types";
import { api } from "./api";

type CreateCalendarDTO = components["schemas"]["CreateCalendarDTO"];

export async function getCalendar() {
    const response = await api.get("api/Calendar");
    return response.data;
}

export async function createCalendar(request: CreateCalendarDTO) {
    const response = await api.post<CreateCalendarDTO>("api/Calendar", request);
    return response.data;
}
