import { useEffect, useState, type JSX } from "react";
import { Navigate } from "react-router-dom";
import api from "../services/api";

interface Props {
    children: JSX.Element;
}

function ProtectedRoute({ children }: Props): JSX.Element {
    const [isAuthorized, setIsAuthorized] = useState<null | boolean>(null);

    useEffect(() => {
        verifyAuth().catch(() => setIsAuthorized(false));
    }, []);

    const verifyAuth = async () => {
        try {
            const response = await api.post("/api/token/verify/");
            setIsAuthorized(response.status === 200);
        } catch (error) {
            console.log(error);
            try {
                await api.post("/api/token/refresh/");
                setIsAuthorized(true);
            } catch (refreshError) {
                console.log(refreshError);
                setIsAuthorized(false);
            }
        }
    };

    if (isAuthorized === null) {
        return <div>Loading...</div>;
    }

    return isAuthorized ? children : <Navigate to="/sign-in" />;
}

export default ProtectedRoute;
