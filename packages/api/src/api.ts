import { isNative } from "@repo/utils";
import axios from "axios";
import {
	clearTokens,
	getAccessToken,
	getRefreshToken,
	setTokens,
} from "./nativeTokenStorage";

function getBaseUrl() {
	if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
	if (process.env.EXPO_PUBLIC_API_URL) return process.env.EXPO_PUBLIC_API_URL;
	return "http://localhost:5273";
}

export const api = axios.create({
	baseURL: getBaseUrl(),
	// Only use credentials (cookies) for web, not native
	withCredentials: !isNative(),
	headers: {
		"Content-Type": "application/json",
	},
});

// Flag to indicate if a token refresh is in progress
let isRefreshing = false;

interface QueueItem {
	resolve: (value?: unknown) => void;
	reject: (reason?: unknown) => void;
}

// Queue to hold requests while token is being refreshed
let failedQueue: QueueItem[] = [];

// Function to process the queue after token refresh
const processQueue = (error: unknown, token: string | null = null) => {
	failedQueue.forEach((prom) => {
		if (error) {
			prom.reject(error);
		} else {
			prom.resolve(token);
		}
	});

	failedQueue = [];
};

// List of endpoints that should NOT trigger a refresh
const authEndpoints = [
	"api/auth/verify",
	"api/auth/refresh",
	"api/auth/sign-in",
	"api/auth/sign-up",
	"api/auth/sign-out",
];

// Request interceptor to attach Authorization header for native apps
api.interceptors.request.use(
	async (config) => {
		// Only attach token for native apps (web uses cookies)
		if (isNative()) {
			const accessToken = await getAccessToken();
			if (accessToken) {
				config.headers.Authorization = `Bearer ${accessToken}`;
			}

			// For refresh endpoint, also attach refresh token in header
			if (config.url?.includes("api/auth/refresh")) {
				const refreshToken = await getRefreshToken();
				if (refreshToken) {
					config.headers["X-Refresh-Token"] = refreshToken;
				}
			}
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Response interceptor to handle 401 errors and token refresh
api.interceptors.response.use(
	async (response) => {
		// For native apps, store tokens from response if present
		if (isNative() && response.data) {
			const { accessToken, refreshToken } = response.data;
			if (accessToken && refreshToken) {
				await setTokens(accessToken, refreshToken);
			}
		}
		return response;
	},
	async (error) => {
		// Original request that caused the error
		const originalRequest = error.config;
		const requestUrl = originalRequest?.url || "";

		// Skip refresh logic for auth endpoints
		const isAuthEndpoint = authEndpoints.some((endpoint) =>
			requestUrl.includes(endpoint)
		);

		// If 401 error and not already retried, attempt to refresh token
		if (
			error.response?.status === 401 &&
			!originalRequest._retry &&
			!isAuthEndpoint
		) {
			// If a refresh is already in progress, queue the request
			if (isRefreshing) {
				return new Promise((resolve, reject) => {
					failedQueue.push({ resolve, reject });
				})
					.then(() => {
						return api(originalRequest);
					})
					.catch((err) => {
						return Promise.reject(err);
					});
			}

			// Mark the request as retried
			originalRequest._retry = true;
			isRefreshing = true;

			// Attempt to refresh the token
			try {
				await api.get("api/auth/refresh");
				processQueue(null);
				return api(originalRequest);
			} catch (refreshError) {
				// If refresh fails, reject all queued requests
				processQueue(refreshError, null);
				// Clear tokens and sign out
				await clearTokens();
				// Dynamically import to avoid circular dependency
				const { signOut } = await import("./auth");
				await signOut();
			} finally {
				isRefreshing = false;
			}
		}

		// If the error is not a 401 or already retried, reject the promise
		return Promise.reject(error);
	}
);
