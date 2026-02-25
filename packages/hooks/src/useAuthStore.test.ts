import { describe, expect, test, beforeEach, jest } from "@jest/globals";
import { verify, refresh } from "@repo/api";
import { useAuthStore } from "./useAuthStore";

jest.mock("@repo/api", () => ({
    verify: jest.fn(),
    refresh: jest.fn(),
}));

const mockedVerify = verify as jest.MockedFunction<typeof verify>;
const mockedRefresh = refresh as jest.MockedFunction<typeof refresh>;

beforeEach(() => {
    useAuthStore.setState({
        isAuthorized: false,
        isLoading: true,
    });
    jest.clearAllMocks();
});

describe("useAuthStore initial state", () => {
    test("isAuthorized is false", () => {
        expect(useAuthStore.getState().isAuthorized).toBe(false);
    });

    test("isLoading is true", () => {
        expect(useAuthStore.getState().isLoading).toBe(true);
    });
});

describe("setIsAuthorized", () => {
    test("sets isAuthorized to true", () => {
        useAuthStore.getState().setIsAuthorized(true);
        expect(useAuthStore.getState().isAuthorized).toBe(true);
    });

    test("sets isAuthorized to false", () => {
        useAuthStore.getState().setIsAuthorized(true);
        useAuthStore.getState().setIsAuthorized(false);
        expect(useAuthStore.getState().isAuthorized).toBe(false);
    });
});

describe("verifyAuth", () => {
    test("sets isAuthorized to true when verify() succeeds", async () => {
        mockedVerify.mockResolvedValueOnce(undefined as any);

        await useAuthStore.getState().verifyAuth();

        expect(useAuthStore.getState().isAuthorized).toBe(true);
        expect(useAuthStore.getState().isLoading).toBe(false);
        expect(mockedVerify).toHaveBeenCalledTimes(1);
        expect(mockedRefresh).not.toHaveBeenCalled();
    });

    test("falls back to refresh() when verify() fails, sets authorized on refresh success", async () => {
        mockedVerify.mockRejectedValueOnce(new Error("token expired"));
        mockedRefresh.mockResolvedValueOnce(undefined as any);

        await useAuthStore.getState().verifyAuth();

        expect(useAuthStore.getState().isAuthorized).toBe(true);
        expect(useAuthStore.getState().isLoading).toBe(false);
        expect(mockedVerify).toHaveBeenCalledTimes(1);
        expect(mockedRefresh).toHaveBeenCalledTimes(1);
    });

    test("sets isAuthorized to false when both verify() and refresh() fail", async () => {
        mockedVerify.mockRejectedValueOnce(new Error("token expired"));
        mockedRefresh.mockRejectedValueOnce(new Error("refresh failed"));

        await useAuthStore.getState().verifyAuth();

        expect(useAuthStore.getState().isAuthorized).toBe(false);
        expect(useAuthStore.getState().isLoading).toBe(false);
    });

    test("isLoading is set to true at the start and false at the end", async () => {
        // Start with isLoading = false to observe the transition
        useAuthStore.setState({ isLoading: false });

        mockedVerify.mockImplementation(() => {
            // During execution, isLoading should be true
            expect(useAuthStore.getState().isLoading).toBe(true);
            return Promise.resolve(undefined as any);
        });

        await useAuthStore.getState().verifyAuth();
        expect(useAuthStore.getState().isLoading).toBe(false);
    });
});
