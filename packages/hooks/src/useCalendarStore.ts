import { CalendarViewType } from "@repo/types";
import { create } from "zustand";

export interface CalendarState {
	currentDate: Date;
	selectedDate: Date;
	viewType: CalendarViewType;
	checkedCalendarIds: string[];
	tabletView: boolean;
	mobileView: boolean;
	hideSidebar: boolean;

	setSelectedDate: (date: Date) => void;
	setViewType: (view: CalendarViewType) => void;
	setCheckedCalendarIds: (ids: string[]) => void;
	setTabletView: (tablet: boolean) => void;
	setMobileView: (mobile: boolean) => void;
	setHideSidebar: (hide: boolean) => void;

	resetToToday: () => void;

	initResizeListener: () => () => void;

	decYear: (by: number) => void;
	incYear: (by: number) => void;
	decMonth: () => void;
	incMonth: () => void;
	incWeek: () => void;
	decWeek: () => void;
	incDay: () => void;
	decDay: () => void;
}

const windowGlobal: (Window & typeof globalThis) | undefined =
	typeof window !== "undefined" ? window : undefined;

export const useCalendarStore = create<CalendarState>((set) => ({
	currentDate: new Date(),
	selectedDate: new Date(),
	checkedCalendarIds: [],
	tabletView:
		(windowGlobal?.innerWidth && windowGlobal.innerWidth < 1024) || false, // Hide sidebar by default on smaller screens
	mobileView:
		(windowGlobal?.innerWidth && windowGlobal.innerWidth < 768) || false, // Hide sidebar by default on smaller screens
	hideSidebar:
		(windowGlobal?.innerWidth && windowGlobal.innerWidth < 1024) || false,
	viewType: "month" as CalendarViewType,

	setSelectedDate: (date: Date) => set({ selectedDate: new Date(date) }),
	setViewType: (view: CalendarViewType) => set({ viewType: view }),
	setCheckedCalendarIds: (ids: string[]) => set({ checkedCalendarIds: ids }),
	setMobileView: (mobile: boolean) => set({ mobileView: mobile }),
	setTabletView: (tablet: boolean) => set({ tabletView: tablet }),
	setHideSidebar: (hide: boolean) => set({ hideSidebar: hide }),

	initResizeListener: () => {
		if (typeof window === "undefined") return () => {};

		const handleResize = () => {
			set({ mobileView: window.innerWidth <= 768 });
			set({ tabletView: window.innerWidth <= 1024 });
		};

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	},

	resetToToday: () =>
		set((state) => ({
			selectedDate: (state.selectedDate = new Date(state.currentDate)),
		})),

	decYear: (by: number) =>
		set((state) => ({
			selectedDate: new Date(
				state.selectedDate.setFullYear(
					state.selectedDate.getFullYear() - by,
				),
			),
		})),
	incYear: (by: number) =>
		set((state) => ({
			selectedDate: new Date(
				state.selectedDate.setFullYear(
					state.selectedDate.getFullYear() + by,
				),
			),
		})),

	decMonth: () => {
		set((state) => ({
			selectedDate: new Date(
				state.selectedDate.setMonth(state.selectedDate.getMonth() - 1),
			),
		}));
	},

	incMonth: () => {
		set((state) => ({
			selectedDate: new Date(
				state.selectedDate.setMonth(state.selectedDate.getMonth() + 1),
			),
		}));
	},

	incWeek: () => {
		set((state) => ({
			selectedDate: new Date(
				state.selectedDate.setDate(state.selectedDate.getDate() + 7),
			),
		}));
	},

	decWeek: () => {
		set((state) => ({
			selectedDate: new Date(
				state.selectedDate.setDate(state.selectedDate.getDate() - 7),
			),
		}));
	},
	incDay: () => {
		set((state) => ({
			selectedDate: new Date(
				state.selectedDate.setDate(state.selectedDate.getDate() + 1),
			),
		}));
	},
	decDay: () => {
		set((state) => ({
			selectedDate: new Date(
				state.selectedDate.setDate(state.selectedDate.getDate() - 1),
			),
		}));
	},
}));
