import { type JSX, type ReactNode } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Navbar from "./components/navbar/Navbar.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import "./css/App.css";
import DailyJournalPage from "./pages/DailyJournalPage.tsx";
import SigninPage from "./pages/SigninPage.tsx";
import SignupPage from "./pages/SignupPage.tsx";
import Home from "./pages/Home.tsx";
import Forum from "./pages/Forum.jsx";
import ProfilePage from "./pages/ProfilePage.tsx";

interface RenderPageProps {
    children?: ReactNode;
    protectedRoute?: boolean;
}

function RenderPage({
    children,
    protectedRoute,
}: RenderPageProps): JSX.Element {
    if (!protectedRoute) {
        return (
            <>
                <Navbar />
                <>{children}</>
            </>
        );
    } else {
        return (
            <ProtectedRoute>
                <Navbar />
                <>{children}</>
            </ProtectedRoute>
        );
    }
}

function App(): JSX.Element {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<RenderPage children={<Home />} />} />
                <Route path="/forum" element={<RenderPage children={<Forum />} />} />
                <Route
                    path="/sign-in"
                    element={<RenderPage children={<SigninPage />} />}
                />
                <Route
                    path="/sign-up"
                    element={<RenderPage children={<SignupPage />} />}
                />
                <Route path="/profile-page" element={<RenderPage children={<ProfilePage />} protectedRoute />} />
                <Route
                    path="/daily-journal"
                    element={
                        <RenderPage
                            children={<DailyJournalPage />}
                            protectedRoute
                        />
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
