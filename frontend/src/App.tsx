import { type JSX } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Navbar from "./components/Navbar.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import "./css/App.css";
import DailyJournalPage from "./pages/DailyJournalPage.tsx";
import SigninPage from "./pages/SigninPage.tsx";
import SignupPage from "./pages/SignupPage.tsx";

function App(): JSX.Element {
    return (
        <Router>
            <Routes>
                <Route
                    path="/sign-in"
                    element={
                        <>
                            <Navbar />
                            <SigninPage />
                        </>
                    }
                />
                <Route
                    path="/sign-up"
                    element={
                        <>
                            <Navbar />
                            <SignupPage />
                        </>
                    }
                />
                <Route
                    path="/daily-journal"
                    element={
                        <ProtectedRoute>
                            <Navbar />
                            <DailyJournalPage />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
