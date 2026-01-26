import { WeekStartDay } from "@repo/types";
import { create } from "zustand";

export interface ProfileState {
	locale: Intl.LocalesArgument;
	weekStartsOn: WeekStartDay;
	hour12: boolean;

	setLocale: (locale: Intl.LocalesArgument) => void;
	setWeekStartsOn: (day: WeekStartDay) => void;
	setHour12: (hour12: boolean) => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
	locale: new Intl.Locale("en"),
	weekStartsOn: "monday" as WeekStartDay,
	hour12: false,

	setLocale: (locale: Intl.LocalesArgument) => set({ locale }),
	setWeekStartsOn: (day: WeekStartDay) => set({ weekStartsOn: day }),
	setHour12: (hour12: boolean) => set({ hour12 }),
}));
