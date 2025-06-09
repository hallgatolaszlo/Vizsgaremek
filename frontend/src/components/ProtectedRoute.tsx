import { useEffect, useState, type JSX, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import api from "../services/api";

interface Props {
    children: ReactNode;
}

function ProtectedRoute({ children }: Props): JSX.Element {
    const [isAuthorized, setIsAuthorized] = useState<null | boolean>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        verifyAuth().catch();
    }, []);

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

    if (loading) {
        return <div className="h-[100vh] bg-color-1">Loading...</div>;
    }

    return isAuthorized ? <>{children}</> : <Navigate to="/sign-in" />;
}

export default ProtectedRoute;
