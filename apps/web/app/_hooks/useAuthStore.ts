import refresh from "@repo/api/auth/refresh";
import verify from "@repo/api/auth/verify";
import { create } from "zustand";

interface AuthState {
	isAuthorized: boolean;
	isLoading: boolean;
	verifyAuth: () => Promise<void>;
	setIsAuthorized: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
	isAuthorized: false,
	isLoading: true,

	setIsAuthorized: (value) => set({ isAuthorized: value }),

	verifyAuth: async () => {
		set({ isLoading: true });
		try {
			await verify();
			set({ isAuthorized: true });
		} catch {
			try {
				await refresh();
				set({ isAuthorized: true });
			} catch {
				set({ isAuthorized: false });
			}
		} finally {
			set({ isLoading: false });
		}
	},
}));
