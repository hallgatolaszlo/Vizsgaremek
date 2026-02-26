import { describe, expect, test, beforeEach } from "@jest/globals";
import { useCalendarStore } from "./useCalendarStore";

// Reset the store before each test to avoid state leaking between tests
beforeEach(() => {
    const now = new Date();
    useCalendarStore.setState({
        currentDate: now,
        selectedDate: new Date(now),
        viewType: "month",
        checkedCalendarIds: [],
    });
});

describe("useCalendarStore initial state", () => {
    test("selectedDate is close to now", () => {
        const { selectedDate } = useCalendarStore.getState();
        const diff = Math.abs(Date.now() - selectedDate.getTime());
        expect(diff).toBeLessThan(5000); // within 5 seconds
    });

    test("viewType defaults to 'month'", () => {
        expect(useCalendarStore.getState().viewType).toBe("month");
    });

    test("checkedCalendarIds is empty", () => {
        expect(useCalendarStore.getState().checkedCalendarIds).toEqual([]);
    });
});

describe("setSelectedDate", () => {
    test("sets the selected date", () => {
        const newDate = new Date("2026-06-15");
        useCalendarStore.getState().setSelectedDate(newDate);
        const { selectedDate } = useCalendarStore.getState();
        expect(selectedDate.getFullYear()).toBe(2026);
        expect(selectedDate.getMonth()).toBe(5); // June = 5
        expect(selectedDate.getDate()).toBe(15);
    });

    test("creates a new Date instance (not a reference)", () => {
        const newDate = new Date("2026-06-15");
        useCalendarStore.getState().setSelectedDate(newDate);
        const { selectedDate } = useCalendarStore.getState();
        expect(selectedDate).not.toBe(newDate);
    });
});

describe("setViewType", () => {
    test("sets viewType to 'week'", () => {
        useCalendarStore.getState().setViewType("week");
        expect(useCalendarStore.getState().viewType).toBe("week");
    });

    test("sets viewType to 'day'", () => {
        useCalendarStore.getState().setViewType("day");
        expect(useCalendarStore.getState().viewType).toBe("day");
    });

    test("sets viewType to 'multiweek'", () => {
        useCalendarStore.getState().setViewType("multiweek");
        expect(useCalendarStore.getState().viewType).toBe("multiweek");
    });
});

describe("setCheckedCalendarIds", () => {
    test("sets calendar IDs", () => {
        useCalendarStore.getState().setCheckedCalendarIds(["abc", "def"]);
        expect(useCalendarStore.getState().checkedCalendarIds).toEqual([
            "abc",
            "def",
        ]);
    });

    test("replaces previous IDs", () => {
        useCalendarStore.getState().setCheckedCalendarIds(["abc"]);
        useCalendarStore.getState().setCheckedCalendarIds(["xyz"]);
        expect(useCalendarStore.getState().checkedCalendarIds).toEqual(["xyz"]);
    });
});

describe("incMonth / decMonth", () => {
    test("incMonth advances the month by 1", () => {
        useCalendarStore.getState().setSelectedDate(new Date("2026-03-15"));
        useCalendarStore.getState().incMonth();
        const { selectedDate } = useCalendarStore.getState();
        expect(selectedDate.getMonth()).toBe(3); // April
    });

    test("decMonth goes back 1 month", () => {
        useCalendarStore.getState().setSelectedDate(new Date("2026-03-15"));
        useCalendarStore.getState().decMonth();
        const { selectedDate } = useCalendarStore.getState();
        expect(selectedDate.getMonth()).toBe(1); // February
    });

    test("incMonth wraps from December to January of next year", () => {
        useCalendarStore.getState().setSelectedDate(new Date("2026-12-15"));
        useCalendarStore.getState().incMonth();
        const { selectedDate } = useCalendarStore.getState();
        expect(selectedDate.getMonth()).toBe(0); // January
        expect(selectedDate.getFullYear()).toBe(2027);
    });

    test("decMonth wraps from January to December of previous year", () => {
        useCalendarStore.getState().setSelectedDate(new Date("2026-01-15"));
        useCalendarStore.getState().decMonth();
        const { selectedDate } = useCalendarStore.getState();
        expect(selectedDate.getMonth()).toBe(11); // December
        expect(selectedDate.getFullYear()).toBe(2025);
    });
});

describe("incWeek / decWeek", () => {
    test("incWeek advances by 7 days", () => {
        useCalendarStore.getState().setSelectedDate(new Date("2026-03-10"));
        useCalendarStore.getState().incWeek();
        const { selectedDate } = useCalendarStore.getState();
        expect(selectedDate.getDate()).toBe(17);
    });

    test("decWeek goes back 7 days", () => {
        useCalendarStore.getState().setSelectedDate(new Date("2026-03-17"));
        useCalendarStore.getState().decWeek();
        const { selectedDate } = useCalendarStore.getState();
        expect(selectedDate.getDate()).toBe(10);
    });

    test("incWeek crosses month boundary", () => {
        useCalendarStore.getState().setSelectedDate(new Date("2026-03-28"));
        useCalendarStore.getState().incWeek();
        const { selectedDate } = useCalendarStore.getState();
        expect(selectedDate.getMonth()).toBe(3); // April
        expect(selectedDate.getDate()).toBe(4);
    });
});

describe("incDay / decDay", () => {
    test("incDay advances by 1 day", () => {
        useCalendarStore.getState().setSelectedDate(new Date("2026-03-10"));
        useCalendarStore.getState().incDay();
        const { selectedDate } = useCalendarStore.getState();
        expect(selectedDate.getDate()).toBe(11);
    });

    test("decDay goes back 1 day", () => {
        useCalendarStore.getState().setSelectedDate(new Date("2026-03-10"));
        useCalendarStore.getState().decDay();
        const { selectedDate } = useCalendarStore.getState();
        expect(selectedDate.getDate()).toBe(9);
    });

    test("incDay crosses month boundary", () => {
        useCalendarStore.getState().setSelectedDate(new Date("2026-03-31"));
        useCalendarStore.getState().incDay();
        const { selectedDate } = useCalendarStore.getState();
        expect(selectedDate.getMonth()).toBe(3); // April
        expect(selectedDate.getDate()).toBe(1);
    });

    test("decDay crosses month boundary", () => {
        useCalendarStore.getState().setSelectedDate(new Date("2026-04-01"));
        useCalendarStore.getState().decDay();
        const { selectedDate } = useCalendarStore.getState();
        expect(selectedDate.getMonth()).toBe(2); // March
        expect(selectedDate.getDate()).toBe(31);
    });
});

describe("incYear / decYear", () => {
    test("incYear advances by given years", () => {
        useCalendarStore.getState().setSelectedDate(new Date("2026-03-15"));
        useCalendarStore.getState().incYear(1);
        expect(useCalendarStore.getState().selectedDate.getFullYear()).toBe(
            2027,
        );
    });

    test("decYear goes back by given years", () => {
        useCalendarStore.getState().setSelectedDate(new Date("2026-03-15"));
        useCalendarStore.getState().decYear(2);
        expect(useCalendarStore.getState().selectedDate.getFullYear()).toBe(
            2024,
        );
    });
});

describe("resetToToday", () => {
    test("resets selectedDate to currentDate", () => {
        useCalendarStore.getState().setSelectedDate(new Date("2020-01-01"));
        useCalendarStore.getState().resetToToday();
        const { selectedDate, currentDate } = useCalendarStore.getState();
        expect(selectedDate.getFullYear()).toBe(currentDate.getFullYear());
        expect(selectedDate.getMonth()).toBe(currentDate.getMonth());
        expect(selectedDate.getDate()).toBe(currentDate.getDate());
    });
});
