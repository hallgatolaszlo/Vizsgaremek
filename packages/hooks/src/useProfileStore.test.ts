import { describe, expect, test, beforeEach } from "@jest/globals";
import { useProfileStore } from "./useProfileStore";

beforeEach(() => {
    useProfileStore.setState({
        locale: new Intl.Locale("en-US"),
        weekStartsOn: "monday",
        hour12: false,
    });
});

describe("useProfileStore initial/reset state", () => {
    test("weekStartsOn defaults to 'monday'", () => {
        expect(useProfileStore.getState().weekStartsOn).toBe("monday");
    });

    test("hour12 defaults to false", () => {
        expect(useProfileStore.getState().hour12).toBe(false);
    });

    test("locale is an Intl.Locale instance", () => {
        expect(useProfileStore.getState().locale).toBeInstanceOf(Intl.Locale);
    });
});

describe("setLocale", () => {
    test("sets locale to a new Intl.Locale", () => {
        const huLocale = new Intl.Locale("hu-HU");
        useProfileStore.getState().setLocale(huLocale);
        expect(useProfileStore.getState().locale.language).toBe("hu");
    });

    test("changes locale from default", () => {
        const deLocale = new Intl.Locale("de-DE");
        useProfileStore.getState().setLocale(deLocale);
        expect(useProfileStore.getState().locale.language).toBe("de");
    });
});

describe("setWeekStartsOn", () => {
    test("sets weekStartsOn to 'sunday'", () => {
        useProfileStore.getState().setWeekStartsOn("sunday");
        expect(useProfileStore.getState().weekStartsOn).toBe("sunday");
    });

    test("sets weekStartsOn back to 'monday'", () => {
        useProfileStore.getState().setWeekStartsOn("sunday");
        useProfileStore.getState().setWeekStartsOn("monday");
        expect(useProfileStore.getState().weekStartsOn).toBe("monday");
    });
});

describe("setHour12", () => {
    test("sets hour12 to true", () => {
        useProfileStore.getState().setHour12(true);
        expect(useProfileStore.getState().hour12).toBe(true);
    });

    test("sets hour12 to false", () => {
        useProfileStore.getState().setHour12(true);
        useProfileStore.getState().setHour12(false);
        expect(useProfileStore.getState().hour12).toBe(false);
    });
});
