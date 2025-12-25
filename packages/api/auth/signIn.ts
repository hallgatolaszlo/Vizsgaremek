import api from "@repo/api";
import { components } from "@repo/types";

type SignInRequestDTO = components["schemas"]["SignInRequestDTO"];

export default async function signIn(request: SignInRequestDTO) {
	const response = await api.post("api/auth/sign-in", request);
	window.location.href = "/protected";
	return response.data;
}
