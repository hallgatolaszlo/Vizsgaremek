import { useEffect, useState, type JSX } from "react";
import { themes, type Theme } from "../../themes/themes";
import { ThemeContext } from "./ThemeContext";

interface Props {
    children: JSX.Element;
}

export const ThemeProvider = ({ children }: Props) => {
    const [currentTheme, setCurrentTheme] = useState<string>(
        localStorage.getItem("theme") || "darkBlue"
    );

    const applyTheme = (theme: Theme) => {
        const root = document.documentElement;
        Object.entries(theme).forEach(([varName, value]) => {
            root.style.setProperty(`--${varName}`, value);
        });
        localStorage.setItem("theme", currentTheme);
    };

    useEffect(() => {
        applyTheme(themes[currentTheme]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentTheme]);

    const value = {
        currentTheme,
        setCurrentTheme,
    };

    return (
        <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    );
};
