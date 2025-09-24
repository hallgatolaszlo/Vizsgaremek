import { useCallback, useEffect, useRef, useState, type JSX } from "react";
import api from "../../services/api";
import { AuthContext } from "./AuthContext";

interface Props {
    children: JSX.Element;
}

export const AuthProvider = ({ children }: Props) => {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [loading, setLoading] = useState(true);
    const effectRan = useRef(false);

    const verifyAuth = useCallback(async () => {
        // Set loading to true at the start of a check
        setLoading(true);
        try {
            const response = await api.get("api/auth/verify");
            setIsAuthorized(response.status === 200);
        } catch {
            try {
                await api.get("api/auth/refresh");
                // After a successful refresh, you might want to re-verify
                const response = await api.get("api/auth/verify");
                setIsAuthorized(response.status === 200);
            } catch {
                setIsAuthorized(false);
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (effectRan.current === false) {
            verifyAuth();

            return () => {
                effectRan.current = true;
            };
        }
    }, [verifyAuth]);

    const value = {
        isAuthorized,
        setIsAuthorized,
        loading,
        setLoading,
        verifyAuth,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};
