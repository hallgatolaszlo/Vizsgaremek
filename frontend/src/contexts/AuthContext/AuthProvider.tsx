import { useState, type JSX } from "react";
import api from "../../services/api";
import { AuthContext } from "./AuthContext";

interface Props {
    children: JSX.Element;
}

export const AuthProvider = ({ children }: Props) => {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [loading, setLoading] = useState(true);

    const verifyAuth = async () => {
        try {
            const response = await api.post("/api/token/verify/");
            setIsAuthorized(response.status === 200);
        } catch {
            try {
                await api.post("/api/token/refresh/");
                setIsAuthorized(true);
            } catch {
                setIsAuthorized(false);
            }
        } finally {
            setLoading(false);
        }
    };

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
