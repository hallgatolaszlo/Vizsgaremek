import { WeekStartDay } from "@repo/types";
import { create } from "zustand";

export interface CalendarState {
	currentDate: Date;
	selectedDate: Date;
	weekStartsOn: WeekStartDay;

	setSelectedDate: (date: Date) => void;
	setWeekStartsOn: (day: WeekStartDay) => void;

	resetToToday: () => void;

	decYear: (by: number) => void;
	incYear: (by: number) => void;
	decMonth: () => void;
	incMonth: () => void;
	incWeek: () => void;
	decWeek: () => void;
}

export const useCalendarStore = create<CalendarState>((set) => ({
	currentDate: new Date(),
	selectedDate: new Date(),
	weekStartsOn: "monday" as WeekStartDay,

	setSelectedDate: (date: Date) => set({ selectedDate: date }),
	setWeekStartsOn: (day: WeekStartDay) => set({ weekStartsOn: day }),

	resetToToday: () =>
		set((state) => ({
			selectedDate: (state.selectedDate = new Date(state.currentDate)),
		})),

	decYear: (by: number) =>
		set((state) => ({
			selectedDate: new Date(
				state.selectedDate.setFullYear(
					state.selectedDate.getFullYear() - by
				)
			),
		})),
	incYear: (by: number) =>
		set((state) => ({
			selectedDate: new Date(
				state.selectedDate.setFullYear(
					state.selectedDate.getFullYear() + by
				)
			),
		})),

	decMonth: () => {
		set((state) => ({
			selectedDate: new Date(
				state.selectedDate.setMonth(state.selectedDate.getMonth() - 1)
			),
		}));
	},

	incMonth: () => {
		set((state) => ({
			selectedDate: new Date(
				state.selectedDate.setMonth(state.selectedDate.getMonth() + 1)
			),
		}));
	},

	incWeek: () => {
		set((state) => ({
			selectedDate: new Date(
				state.selectedDate.setDate(state.selectedDate.getDate() + 7)
			),
		}));
	},

	decWeek: () => {
		set((state) => ({
			selectedDate: new Date(
				state.selectedDate.setDate(state.selectedDate.getDate() - 7)
			),
		}));
	},
}));
