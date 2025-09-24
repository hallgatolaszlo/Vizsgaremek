import type { JSX } from "@emotion/react/jsx-runtime";
import { createElement, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext/UseAuth";
import "../../css/DropDownContent.css";
import api from "../../services/api";
import useClickOutside from "./DropDownHandle";

function ProfileRender(): JSX.Element {
    const { isAuthorized, verifyAuth } = useAuth();
    const navigate = useNavigate();

    const showProfileBar = () => {
        setIsOpen(!isOpen);
    };

    function render() {
        const elements = [];
        if (isAuthorized) {
            elements.push(
                createElement(
                    Link,
                    {
                        to: "/profile-page",
                        key: 1,
                        onClick: showProfileBar,
                        className: `flex place-content-between cursor-pointer p-3 pt-[0]`,
                    },
                    "Profile"
                ),
                createElement(
                    Link,
                    {
                        to: "/",
                        key: 2,
                        onClick: showProfileBar,
                        className: `flex place-content-between cursor-pointer p-3`,
                    },
                    "Profile-settings"
                ),
                createElement(
                    "a",
                    {
                        key: 3,
                        className:
                            "cursor-pointer flex place-content-between cursor-pointer p-3 text-center",
                        onClick: async () => {
                            try {
                                await api.post("api/auth/logout");
                                verifyAuth();
                                navigate("/");
                            } catch (error) {
                                console.log(error);
                            }
                        },
                    },
                    "Sign-out"
                )
            );
        } else {
            elements.push(
                createElement(
                    Link,
                    {
                        to: "/sign-in",
                        key: 4,
                        onClick: showProfileBar,
                        className: `flex place-content-between cursor-pointer p-3`,
                    },
                    "Sign-in"
                ),
                createElement(
                    Link,
                    {
                        to: "/sign-up",
                        key: 5,
                        onClick: showProfileBar,
                        className: `flex place-content-between cursor-pointer p-3`,
                    },
                    "Sign-up"
                )
            );
        }
        return createElement(
            "div",
            {
                key: 0,
                ref: profileDropdown,
                className: `absolute translate-x-[-85%] bg-white flex-col rounded-md mt-[5px] pt-0 pb-0 flex w-[10rem] text-center ${
                    isOpen && "dropdown-content"
                }`,
            },
            elements
        );
    }

    const [isOpen, setIsOpen] = useState(false);
    const profileDropdown = useClickOutside(
        async () => setIsOpen(false),
        isOpen
    );
    return (
        <div>
            <button
                onClick={() => {
                    setIsOpen(true);
                }}
                className="text-[var(--text-color-1)] cursor-pointer"
            >
                <CgProfile className="text-[1.8rem]" />
            </button>
            {isOpen && render()}
        </div>
    );
}

export default ProfileRender;
