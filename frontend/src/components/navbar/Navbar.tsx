import type { JSX } from "react";
import { Link, useNavigate } from "react-router-dom";
import ThemeSwitcher from "./ThemeSwitcher";
import ProfileRender from "./NavbarProfile";

function Navbar(): JSX.Element {
    const navigate = useNavigate();

    return (
        <header className="fixed w-screen h-[5rem] bg-[var(--bg-color-1)] flex place-content-between">
            <h1
                className="title-font text-[var(--text-color-1)] cursor-pointer text-[2rem] m-[0.5rem] pl-[0.5rem]"
                onClick={() => {
                    navigate("/");
                }}
            >
                MentaVia
            </h1>
            <div className="flex gap-[10px] items-center pr-[1rem]">
                <Link to="/forum" className="text-[var(--text-color-1)] text-[1.8rem]">Forum</Link>
                <ThemeSwitcher />
                <ProfileRender />
            </div>
        </header>
    );
}

export default Navbar;
