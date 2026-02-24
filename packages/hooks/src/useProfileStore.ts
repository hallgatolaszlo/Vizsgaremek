import { WeekStartDay } from "@repo/types";
import { create } from "zustand";

export interface ProfileState {
    locale: Intl.Locale;
    weekStartsOn: WeekStartDay;
    hour12: boolean;

    setLocale: (locale: Intl.Locale) => void;
    setWeekStartsOn: (day: WeekStartDay) => void;
    setHour12: (hour12: boolean) => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
    locale: new Intl.Locale(navigator.language),
    weekStartsOn: "monday" as WeekStartDay,
    hour12: false,

    setLocale: (locale: Intl.Locale) => set({ locale }),
    setWeekStartsOn: (day: WeekStartDay) => set({ weekStartsOn: day }),
    setHour12: (hour12: boolean) => set({ hour12 }),
}));
