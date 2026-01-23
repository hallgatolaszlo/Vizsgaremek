import { CalendarViewType, WeekStartDay } from "@repo/types";
import { create } from "zustand";

export interface CalendarState {
	currentDate: Date;
	selectedDate: Date;
	weekStartsOn: WeekStartDay;
	viewType: CalendarViewType;

	setSelectedDate: (date: Date) => void;
	setWeekStartsOn: (day: WeekStartDay) => void;
	setViewType: (view: CalendarViewType) => void;

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
	weekStartsOn: "month" as WeekStartDay,
	viewType: "month" as CalendarViewType,

	setSelectedDate: (date: Date) => set({ selectedDate: new Date(date) }),
	setWeekStartsOn: (day: WeekStartDay) => set({ weekStartsOn: day }),
	setViewType: (view: CalendarViewType) => set({ viewType: view }),

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
