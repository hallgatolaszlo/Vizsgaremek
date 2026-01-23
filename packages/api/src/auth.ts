import { components } from "@repo/types";
import { api } from "./api";
import { clearTokens } from "./nativeTokenStorage";

type SignUpRequestDTO = components["schemas"]["SignUpRequestDTO"];
type SignInRequestDTO = components["schemas"]["SignInRequestDTO"];
type TokenResponseDTO = components["schemas"]["TokenResponseDTO"];

export async function signUp(request: SignUpRequestDTO) {
	const response = await api.post("api/auth/sign-up", request);
	return response.data;
}

export async function signIn(
	request: SignInRequestDTO,
): Promise<TokenResponseDTO | void> {
	const response = await api.post<TokenResponseDTO>(
		"api/auth/sign-in",
		request,
	);
	return response.data;
}

export async function signOut() {
	// Clear locally stored tokens
	await clearTokens();
	// Clear cookies/server-side session
	await api.get("api/auth/sign-out");
}

export async function verify() {
	const response = await api.get("api/auth/verify");
	return response.data;
}

export async function refresh(): Promise<TokenResponseDTO | void> {
	const response = await api.get<TokenResponseDTO>("api/auth/refresh");
	return response.data;
}
