import api from "@repo/api";
export default async function verify() {
	const response = await api.get("api/auth/verify");
	return response.data;
}
