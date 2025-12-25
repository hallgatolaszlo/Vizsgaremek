import api from "@repo/api";
import { components } from "@repo/types";

type SignUpRequestDTO = components["schemas"]["SignUpRequestDTO"];

export default async function signUp(request: SignUpRequestDTO) {
	const response = await api.post("api/auth/sign-up", request);
	return response.data;
}
