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
				state.selectedDate.getFullYear() - by,
				state.selectedDate.getMonth(),
				state.selectedDate.getDate()
			),
		})),
	incYear: (by: number) =>
		set((state) => ({
			selectedDate: new Date(
				state.selectedDate.getFullYear() + by,
				state.selectedDate.getMonth(),
				state.selectedDate.getDate()
			),
		})),

	decMonth: () => {
		set((state) => {
			if (state.selectedDate.getMonth() === 0) {
				return {
					selectedDate: new Date(
						state.selectedDate.getFullYear() - 1,
						11,
						state.selectedDate.getDate()
					),
				};
			}
			return {
				selectedDate: new Date(
					state.selectedDate.getFullYear(),
					state.selectedDate.getMonth() - 1,
					state.selectedDate.getDate()
				),
			};
		});
	},

	incMonth: () => {
		set((state) => {
			if (state.selectedDate.getMonth() === 11) {
				return {
					selectedDate: new Date(
						state.selectedDate.getFullYear() + 1,
						0,
						state.selectedDate.getDate()
					),
				};
			}
			return {
				selectedDate: new Date(
					state.selectedDate.getFullYear(),
					state.selectedDate.getMonth() + 1,
					state.selectedDate.getDate()
				),
			};
		});
	},

	incWeek: () => {
		set((state) => ({
			selectedDate: new Date(
				state.selectedDate.getFullYear(),
				state.selectedDate.getMonth(),
				state.selectedDate.getDate() + 7
			),
		}));
	},

	decWeek: () => {
		set((state) => ({
			selectedDate: new Date(
				state.selectedDate.getFullYear(),
				state.selectedDate.getMonth(),
				state.selectedDate.getDate() - 7
			),
		}));
	},
}));
