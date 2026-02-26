import { describe, expect, test, beforeEach } from "@jest/globals";
import { useContextMenuStore } from "./useContextMenuStore";

beforeEach(() => {
    useContextMenuStore.setState({
        menuWidth: 200,
        menuHeight: 50,
        display: "none",
        position: { x: 0, y: 0 },
        contextMenuOpen: false,
        fieldType: null,
        date: null,
    });
});

describe("useContextMenuStore initial state", () => {
    test("display is 'none'", () => {
        expect(useContextMenuStore.getState().display).toBe("none");
    });

    test("contextMenuOpen is false", () => {
        expect(useContextMenuStore.getState().contextMenuOpen).toBe(false);
    });

    test("position is {x: 0, y: 0}", () => {
        expect(useContextMenuStore.getState().position).toEqual({ x: 0, y: 0 });
    });

    test("fieldType is null", () => {
        expect(useContextMenuStore.getState().fieldType).toBeNull();
    });

    test("date is null", () => {
        expect(useContextMenuStore.getState().date).toBeNull();
    });
});

describe("showMenu / hideMenu", () => {
    test("showMenu sets display to 'block' and contextMenuOpen to true", () => {
        useContextMenuStore.getState().showMenu();
        const state = useContextMenuStore.getState();
        expect(state.display).toBe("block");
        expect(state.contextMenuOpen).toBe(true);
    });

    test("hideMenu sets display to 'none' and contextMenuOpen to false", () => {
        useContextMenuStore.getState().showMenu();
        useContextMenuStore.getState().hideMenu();
        const state = useContextMenuStore.getState();
        expect(state.display).toBe("none");
        expect(state.contextMenuOpen).toBe(false);
    });

    test("calling hideMenu when already hidden is safe", () => {
        useContextMenuStore.getState().hideMenu();
        const state = useContextMenuStore.getState();
        expect(state.display).toBe("none");
        expect(state.contextMenuOpen).toBe(false);
    });
});

describe("setPosition", () => {
    test("sets position correctly", () => {
        useContextMenuStore.getState().setPosition({ x: 150, y: 300 });
        expect(useContextMenuStore.getState().position).toEqual({
            x: 150,
            y: 300,
        });
    });
});

describe("setDisplay", () => {
    test("sets display to 'block'", () => {
        useContextMenuStore.getState().setDisplay("block");
        expect(useContextMenuStore.getState().display).toBe("block");
    });

    test("sets display to 'none'", () => {
        useContextMenuStore.getState().setDisplay("block");
        useContextMenuStore.getState().setDisplay("none");
        expect(useContextMenuStore.getState().display).toBe("none");
    });
});

describe("setFieldType", () => {
    test("sets fieldType to 'cell'", () => {
        useContextMenuStore.getState().setFieldType("cell");
        expect(useContextMenuStore.getState().fieldType).toBe("cell");
    });

    test("sets fieldType to 'schedule'", () => {
        useContextMenuStore.getState().setFieldType("schedule");
        expect(useContextMenuStore.getState().fieldType).toBe("schedule");
    });

    test("sets fieldType to null", () => {
        useContextMenuStore.getState().setFieldType("cell");
        useContextMenuStore.getState().setFieldType(null);
        expect(useContextMenuStore.getState().fieldType).toBeNull();
    });
});

describe("setDate", () => {
    test("sets date to a Date object", () => {
        const date = new Date("2026-06-15");
        useContextMenuStore.getState().setDate(date);
        const stored = useContextMenuStore.getState().date;
        expect(stored).toBeInstanceOf(Date);
        expect(stored!.getFullYear()).toBe(2026);
        expect(stored!.getMonth()).toBe(5);
        expect(stored!.getDate()).toBe(15);
    });

    test("sets date to null", () => {
        useContextMenuStore.getState().setDate(new Date());
        useContextMenuStore.getState().setDate(null);
        expect(useContextMenuStore.getState().date).toBeNull();
    });

    test("creates a new Date instance (not a reference)", () => {
        const date = new Date("2026-06-15");
        useContextMenuStore.getState().setDate(date);
        const stored = useContextMenuStore.getState().date;
        expect(stored).not.toBe(date);
    });
});
