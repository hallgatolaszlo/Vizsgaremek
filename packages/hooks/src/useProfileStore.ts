import { WeekStartDay } from "@repo/types";
import { create } from "zustand";

const isBrowser = typeof window !== "undefined";

const weekStartsOnDefault =
    (isBrowser
        ? (localStorage.getItem("weekStartsOn") as WeekStartDay)
        : null) || "monday";
const hour12Default = isBrowser
    ? localStorage.getItem("hour12") === "true"
    : false;

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
    weekStartsOn: weekStartsOnDefault,
    hour12: hour12Default,

    setLocale: (locale: Intl.Locale) => set({ locale }),
    setWeekStartsOn: (day: WeekStartDay) => {
        set({ weekStartsOn: day });
        localStorage.setItem("weekStartsOn", day);
    },
    setHour12: (hour12: boolean) => {
        set({ hour12 });
        localStorage.setItem("hour12", hour12.toString());
    },
}));
