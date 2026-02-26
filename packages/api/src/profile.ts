import { api } from "./api";
import { components } from "@repo/types";

type GetProfileDto = components["schemas"]["GetProfileDTO"];
type UpdateProfileDto = components["schemas"]["UpdateProfileDTO"];

export async function getProfile() {
    const response = await api.get<GetProfileDto>("api/Profile");
    return response.data;
}

export async function updateProfile(request: UpdateProfileDto) {
    const response = await api.put<UpdateProfileDto>(
        `api/Profile/${request.id}`,
        request,
    );
    return response.data;
}
