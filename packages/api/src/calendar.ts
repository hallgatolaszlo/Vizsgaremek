import { components } from "@repo/types";
import { api } from "./api";

type CreateCalendarDTO = components["schemas"]["CreateCalendarDTO"];
type GetCalendarDTO = components["schemas"]["GetCalendarDTO"];
type UpdateCalendarDTO = components["schemas"]["UpdateCalendarDTO"];

export async function getCalendar() {
	const response = await api.get<GetCalendarDTO[]>("api/Calendar");
	return response.data;
}

export async function createCalendar(request: CreateCalendarDTO) {
	const response = await api.post<CreateCalendarDTO>("api/Calendar", request);
	return response.data;
}

export async function updateCalendar(request: UpdateCalendarDTO) {
	const response = await api.put<UpdateCalendarDTO>(
		`api/Calendar/${request.id}`,
		request,
	);
	return response.data;
}

export async function deleteCalendar(id: string) {
	const response = await api.delete(`api/Calendar/${id}`);
	return response.data;
}
