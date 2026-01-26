import { components } from "@repo/types";
import { api } from "./api";

type CreateCalendarDTO = components["schemas"]["CreateCalendarDTO"];
type GetCalendarDTO = components["schemas"]["GetCalendarDTO"];

export async function getCalendar() {
	const response = await api.get<GetCalendarDTO[]>("api/Calendar");
	return response.data;
}

export async function createCalendar(request: CreateCalendarDTO) {
	const response = await api.post<CreateCalendarDTO>("api/Calendar", request);
	return response.data;
}
