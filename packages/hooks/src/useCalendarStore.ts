import { WeekStartDay } from "@repo/types";
import { Month } from "@repo/utils";
import { create } from "zustand";

export interface CalendarState {
	selectedYear: number;
	selectedMonth: Month;
	selectedDate: Date | null;
	currentDate: Date;
	weekStartsOn: WeekStartDay;

	setSelectedYear: (year: number) => void;
	setSelectedMonth: (month: Month) => void;
	setSelectedDate: (date: Date) => void;
	setCurrentDate: (date: Date) => void;
	setWeekStartsOn: (day: WeekStartDay) => void;

	decYear: (by: number) => void;
	incYear: (by: number) => void;
	decMonth: () => void;
	incMonth: () => void;
}

export const useCalendarStore = create<CalendarState>((set) => ({
	selectedYear: new Date().getFullYear(),
	selectedMonth: new Month(0, new Date().getMonth()),
	selectedDate: null,
	currentDate: new Date(),
	weekStartsOn: "monday" as WeekStartDay,

	setSelectedYear: (year: number) => set({ selectedYear: year }),
	setSelectedMonth: (month: Month) => set({ selectedMonth: month }),
	setSelectedDate: (date: Date) => set({ selectedDate: date }),
	setCurrentDate: (date: Date) => set({ currentDate: date }),
	setWeekStartsOn: (day: WeekStartDay) => set({ weekStartsOn: day }),

	decYear: (by: number) =>
		set((state) => ({ selectedYear: state.selectedYear - by })),
	incYear: (by: number) =>
		set((state) => ({ selectedYear: state.selectedYear + by })),

	decMonth: () => {
		set((state) => {
			if (state.selectedMonth.month1Index === 1) {
				return {
					selectedYear: state.selectedYear - 1,
					selectedMonth: new Month(1, 12),
				};
			}
			return {
				selectedMonth: new Month(
					1,
					state.selectedMonth.month1Index - 1
				),
			};
		});
	},

	incMonth: () => {
		set((state) => {
			if (state.selectedMonth.month1Index === 12) {
				return {
					selectedYear: state.selectedYear + 1,
					selectedMonth: new Month(1, 1),
				};
			}
			return {
				selectedMonth: new Month(
					1,
					state.selectedMonth.month1Index + 1
				),
			};
		});
	},
}));
