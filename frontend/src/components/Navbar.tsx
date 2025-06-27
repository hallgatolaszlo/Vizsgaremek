import type { JSX } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import ThemeSwitcher from "./ThemeSwitcher";

function Navbar(): JSX.Element {
    const navigate = useNavigate();

    return (
        <header className="fixed w-screen h-[5rem] bg-[var(--bg-color-1)] flex place-content-between">
            <h1
                className="title-font text-[var(--text-color-1)] cursor-pointer"
                onClick={() => {
                    navigate("/");
                }}
            >
                MentaVia
            </h1>
            <div className="flex gap-[10px]">
                <ThemeSwitcher />
                <Link to="/daily-journal">Daily Journal</Link>
                <Link to="/sign-in">Sign in</Link>
                <Link to="/sign-up">Sign up</Link>
                <a
                    className="cursor-pointer"
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
                </a>
            </div>
        </header>
    );
}

export default Navbar;
