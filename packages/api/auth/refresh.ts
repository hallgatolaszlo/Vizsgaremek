import api from "@repo/api";
export default async function refresh() {
	const response = await api.get("api/auth/refresh");
	return response.data;
}
