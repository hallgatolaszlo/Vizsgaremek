import type { JSX } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import ThemeSwitcher from "./ThemeSwitcher";

function Navbar(): JSX.Element {
    const navigate = useNavigate();

    return (
        <header className="w-screen h-[5rem] bg-[var(--bg-color-1)]">
            <div>
                <h1>MentaVia</h1>
            </div>
            <div className="flex gap-[10px] fixed">
                <button
                    onClick={() => {
                        navigate("/daily-journal");
                    }}
                >
                    Daily Journal
                </button>
                <button
                    onClick={() => {
                        navigate("/sign-in");
                    }}
                >
                    Sign in
                </button>
                <button
                    onClick={() => {
                        navigate("/sign-up");
                    }}
                >
                    Sign up
                </button>
                <button
                    onClick={async () => {
                        try {
                            await api.post("/api/user/logout/");
                            navigate("/");
                        } catch (error) {
                            console.log(error);
                        }
                    }}
                >
                    Sign out
                </button>
                <ThemeSwitcher />
            </div>
        </header>
    );
}

export default Navbar;
