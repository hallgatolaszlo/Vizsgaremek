import api from "@repo/api";
import { components } from "@repo/types";

type SignUpRequestDTO = components["schemas"]["SignUpRequestDTO"];
type SignInRequestDTO = components["schemas"]["SignInRequestDTO"];

export async function signUp(request: SignUpRequestDTO) {
	const response = await api.post("api/auth/sign-up", request);
	return response.data;
}

export async function signIn(request: SignInRequestDTO) {
	const response = await api.post("api/auth/sign-in", request);
	window.location.href = "/protected";
	return response.data;
}

export async function signOut() {
	const response = await api.get("api/auth/sign-out");
	window.location.href = "/sign-in";
	return response.data;
}

export async function verify() {
	const response = await api.get("api/auth/verify");
	return response.data;
}

export async function refresh() {
	const response = await api.get("api/auth/refresh");
	return response.data;
}
