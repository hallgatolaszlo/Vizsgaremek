import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext/useAuth";
import PublicNavbar from "../navbars/PublicNavbar";

export const PublicLayout = () => {
    const { isAuthorized } = useAuth();
    return isAuthorized ? (
        <Navigate to="/authorized" replace />
    ) : (
        <PublicNavbar />
    );
};
