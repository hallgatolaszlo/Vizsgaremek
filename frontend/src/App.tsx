import { Navigate, Route, Routes } from "react-router-dom";
import { PublicLayout } from "./components/layouts/PublicLayout";
import PrivateLayout from "./components/navbars/PrivateNavbar";
import { useAuth } from "./contexts/authContext/useAuth";
import AuthorizedPage from "./pages/AuthorizedPage";
import SignInPage from "./pages/SignInPage";

function App() {
    const { isAuthorized, isLoading } = useAuth();

    // TODO: Show loading page while checking auth status
    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <Routes>
            {!isAuthorized && (
                <Route element={<PublicLayout />}>
                    <Route path="/sign-in" element={<SignInPage />} />
                </Route>
            )}

            {isAuthorized && (
                <Route element={<PrivateLayout />}>
                    <Route path="/authorized" element={<AuthorizedPage />} />
                </Route>
            )}

            <Route
                path="*"
                element={
                    <Navigate
                        to={isAuthorized ? "/authorized" : "/sign-in"}
                        replace
                    />
                }
            />
        </Routes>
    );
}

export default App;
