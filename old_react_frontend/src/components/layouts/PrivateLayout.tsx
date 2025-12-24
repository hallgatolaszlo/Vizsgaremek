import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext/useAuth";
import PrivateNavbar from "../navbars/PrivateNavbar";

export const PrivateLayout = () => {
    const { isAuthorized } = useAuth();
    return isAuthorized ? (
        <PrivateNavbar />
    ) : (
        <Navigate to="/sign-in" replace />
    );
};
