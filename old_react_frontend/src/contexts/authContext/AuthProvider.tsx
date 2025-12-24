import { useCallback, useEffect, useState, type ReactNode } from "react";
import api from "../../services/api.ts";
import { AuthContext } from "./AuthContext.tsx";

interface Props {
    children: ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const verifyAuth = useCallback(async () => {
        setIsLoading(true);
        try {
            // The interceptor in api.ts handles the 401 -> refresh -> retry flow automatically.
            // We just need to wait for the result.
            await api.get("api/auth/verify");
            setIsAuthorized(true);
        } catch {
            try {
                await api.get("api/auth/refresh");
                setIsAuthorized(true);
            } catch {
                setIsAuthorized(false);
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        verifyAuth();
    }, [verifyAuth]);

    const value = {
        isAuthorized,
        setIsAuthorized,
        isLoading,
        setIsLoading,
        verifyAuth,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};
