import type { JSX } from "react";
import { Link } from "react-router-dom";
import ThemeSwitcher from "./ThemeSwitcher";

function Navbar(): JSX.Element {
    return (
        <div className="flex gap-[10px] fixed">
            <ThemeSwitcher />
            <Link className="text-color-1" to="/sign-in">
                Sign In
            </Link>
            <Link className="text-color-1" to="/sign-up">
                Sign Up
            </Link>
        </div>
    );
}

export default Navbar;
