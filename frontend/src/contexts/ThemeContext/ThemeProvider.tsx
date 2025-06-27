import { useEffect, useState, type JSX } from "react";
import { themes, type Theme, themeIndexes } from "../../themes/themes";
import { ThemeContext } from "./ThemeContext";

interface Props {
    children: JSX.Element;
}

export const ThemeProvider = ({ children }: Props) => {
    let savedTheme: { currentTheme: string; currentThemeIndex: number } | null =
        null;

    try {
        const themeStorage = localStorage.getItem("theme");
        savedTheme = themeStorage ? JSON.parse(themeStorage) : null;
    } catch {
        savedTheme = null;
    }

    const [currentTheme, setCurrentTheme] = useState<string>(
        savedTheme?.currentTheme || "darkBlue"
    );
    const [currentThemeIndex, setCurrentThemeIndex] = useState<number>(
        savedTheme?.currentThemeIndex || 1
    );

    const applyTheme = (theme: Theme) => {
        const root = document.documentElement;
        Object.entries(theme).forEach(([varName, value]) => {
            root.style.setProperty(`--${varName}`, value);
        });

        const index = themeIndexes[currentTheme as keyof typeof themeIndexes];

        localStorage.setItem(
            "theme",
            JSON.stringify({
                currentTheme: currentTheme,
                currentThemeIndex: index,
            })
        );
    };

    useEffect(() => {
        applyTheme(themes[currentTheme]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentTheme]);

    const value = {
        currentTheme,
        setCurrentTheme,
        currentThemeIndex,
        setCurrentThemeIndex,
    };

    return (
        <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    );
};
