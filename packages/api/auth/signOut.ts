import api from "@repo/api";
export default async function signOut() {
	const response = await api.get("api/auth/sign-out");
	window.location.href = "/sign-in";
	return response.data;
}
