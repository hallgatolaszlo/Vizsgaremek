import { type JSX, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext/UseAuth";

interface Props {
    children: ReactNode;
}

function ProtectedRoute({ children }: Props): JSX.Element {
    const { loading, isAuthorized } = useAuth();

    if (loading) {
        return <div className="h-[100vh] bg-color-1">Loading...</div>;
    }

    return isAuthorized ? <>{children}</> : <Navigate to="/sign-in" />;
}

export default ProtectedRoute;
