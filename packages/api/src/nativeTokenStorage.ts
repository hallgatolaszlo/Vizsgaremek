import { components } from "@repo/types";

type TokenResponseDTO = components["schemas"]["TokenResponseDTO"];

// Token storage functions - these are stubs for web
// Native apps should call initializeNativeTokenStorage with expo-secure-store

// SecureStore interface matching expo-secure-store API
interface SecureStoreModule {
	setItemAsync: (key: string, value: string) => Promise<void>;
	getItemAsync: (key: string) => Promise<string | null>;
	deleteItemAsync: (key: string) => Promise<void>;
}

// Store reference - will be set by native apps
let secureStore: SecureStoreModule | null = null;

// Called by native apps to provide the SecureStore implementation
export function initializeNativeTokenStorage(store: SecureStoreModule): void {
	secureStore = store;
}

export async function setTokens(
	accessToken: string,
	refreshToken: string
): Promise<void> {
	if (secureStore) {
		await secureStore.setItemAsync("accessToken", accessToken);
		await secureStore.setItemAsync("refreshToken", refreshToken);
	}
	// Web uses cookies, so no-op here
}

export async function getTokens(): Promise<TokenResponseDTO> {
	if (secureStore) {
		const accessToken = await secureStore.getItemAsync("accessToken");
		const refreshToken = await secureStore.getItemAsync("refreshToken");
		return { accessToken, refreshToken };
	}

	// Web uses cookies
	return { accessToken: null, refreshToken: null };
}

export async function getAccessToken(): Promise<string | null> {
	const tokens = await getTokens();
	return tokens.accessToken;
}

export async function getRefreshToken(): Promise<string | null> {
	const tokens = await getTokens();
	return tokens.refreshToken;
}

export async function clearTokens(): Promise<void> {
	if (secureStore) {
		await secureStore.deleteItemAsync("accessToken");
		await secureStore.deleteItemAsync("refreshToken");
	}
	// Web uses cookies, so no-op here
}

export async function hasTokens(): Promise<boolean> {
	const tokens = await getTokens();
	return tokens.accessToken !== null && tokens.refreshToken !== null;
}
