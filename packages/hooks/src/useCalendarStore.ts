import { CalendarViewType } from "@repo/types";
import { create } from "zustand";

export interface CalendarState {
	currentDate: Date;
	selectedDate: Date;
	viewType: CalendarViewType;
	checkedCalendarIds: string[];

	setSelectedDate: (date: Date) => void;
	setViewType: (view: CalendarViewType) => void;
	setCheckedCalendarIds: (ids: string[]) => void;

	resetToToday: () => void;

	decYear: (by: number) => void;
	incYear: (by: number) => void;
	decMonth: () => void;
	incMonth: () => void;
	incWeek: () => void;
	decWeek: () => void;
	incDay: () => void;
	decDay: () => void;
}

export const useCalendarStore = create<CalendarState>((set) => ({
	currentDate: new Date(),
	selectedDate: new Date(),
	checkedCalendarIds: [],

	viewType: "month" as CalendarViewType,

	setSelectedDate: (date: Date) => set({ selectedDate: new Date(date) }),
	setViewType: (view: CalendarViewType) => set({ viewType: view }),
	setCheckedCalendarIds: (ids: string[]) => set({ checkedCalendarIds: ids }),

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
