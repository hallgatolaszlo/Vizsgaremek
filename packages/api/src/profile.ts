import { api } from "./api";

export async function getProfile() {
    const response = await api.get("api/Profile");
    return response.data;
}
