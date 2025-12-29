import axios from "axios";
import { signOut } from "./auth.ts";

const api = axios.create({
	baseURL: "http://localhost:5273/",
	withCredentials: true,
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

// Response interceptor to handle 401 errors and token refresh
api.interceptors.response.use(
	(response) => response,
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
				await signOut();
			} finally {
				isRefreshing = false;
			}
		}

		// If the error is not a 401 or already retried, reject the promise
		return Promise.reject(error);
	}
);

export default api;
