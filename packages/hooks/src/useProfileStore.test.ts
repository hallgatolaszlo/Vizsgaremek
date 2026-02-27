import { beforeEach, describe, expect, jest, test } from "@jest/globals";

// Mock localStorage and navigator before importing the store
const localStorageMock = (() => {
	let store: Record<string, string> = {};
	return {
		getItem: jest.fn((key: string) => store[key] ?? null),
		setItem: jest.fn((key: string, value: string) => {
			store[key] = value;
		}),
		removeItem: jest.fn((key: string) => {
			delete store[key];
		}),
		clear: jest.fn(() => {
			store = {};
		}),
	};
})();

Object.defineProperty(globalThis, "localStorage", {
	value: localStorageMock,
	writable: true,
});
Object.defineProperty(globalThis, "navigator", {
	value: { language: "en-US" },
	writable: true,
});

import { useProfileStore } from "./useProfileStore";

beforeEach(() => {
	localStorageMock.clear();
	localStorageMock.getItem.mockClear();
	localStorageMock.setItem.mockClear();
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

	test("locale language matches navigator.language", () => {
		expect(useProfileStore.getState().locale.language).toBe("en");
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

	test("persists weekStartsOn to localStorage", () => {
		useProfileStore.getState().setWeekStartsOn("sunday");
		expect(localStorageMock.setItem).toHaveBeenCalledWith(
			"weekStartsOn",
			"sunday",
		);
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

	test("persists hour12 to localStorage", () => {
		useProfileStore.getState().setHour12(true);
		expect(localStorageMock.setItem).toHaveBeenCalledWith("hour12", "true");
	});
});
