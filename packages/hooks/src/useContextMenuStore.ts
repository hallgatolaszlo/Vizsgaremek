import { create } from "zustand";

export interface ContextMenuState {
	menuWidth: number;
	menuHeight: number;
	display: "none" | "block";
	position: { x: number; y: number };
	contextMenuOpen: boolean;
	fieldType: "cell" | "schedule" | null;
	date: Date | null;

	setDisplay: (display: "none" | "block") => void;
	setPosition: (position: { x: number; y: number }) => void;
	showMenu: () => void;
	hideMenu: () => void;
	setFieldType: (type: "cell" | "schedule" | null) => void;
	setDate: (date: Date | null) => void;
}

export const useContextMenuStore = create<ContextMenuState>((set) => ({
	menuWidth: 200,
	menuHeight: 50,
	display: "none",
	position: { x: 0, y: 0 },
	contextMenuOpen: false,
	fieldType: null,
	date: null,

	setDisplay: (display: "none" | "block") => set({ display }),
	setPosition: (position: { x: number; y: number }) => set({ position }),
	showMenu: () => set({ display: "block", contextMenuOpen: true }),
	hideMenu: () => set({ display: "none", contextMenuOpen: false }),
	setFieldType: (type: "cell" | "schedule" | null) =>
		set({ fieldType: type }),
	setDate: (date: Date | null) => set({ date: date ? new Date(date) : null }),
}));
