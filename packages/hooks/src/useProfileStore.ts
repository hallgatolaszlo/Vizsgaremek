import { create } from "zustand";

export interface ProfileState {
	locale: Intl.Locale;

	setLocale: (locale: Intl.Locale) => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
	locale: new Intl.Locale("en"),

	setLocale: (locale: Intl.Locale) => set({ locale }),
}));
