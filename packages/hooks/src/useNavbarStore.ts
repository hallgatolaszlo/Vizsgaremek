import { create } from "zustand";

export interface NavbarState {
	isSettingsOpen: boolean;

	setIsSettingsOpen: (isSettingsOpen: boolean) => void;
}

export const useNavbarStore = create<NavbarState>((set) => ({
	isSettingsOpen: false,

	setIsSettingsOpen: (isSettingsOpen: boolean) => set({ isSettingsOpen }),
}));
