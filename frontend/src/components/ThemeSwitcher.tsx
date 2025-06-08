import {useState, useEffect, type JSX} from "react";
import {themes, type Theme} from "../themes/themes.ts";

const themeNames: string[] = Object.keys(themes);
const savedTheme: string | null = localStorage.getItem("theme");
const savedThemeIndex: number = savedTheme && themeNames.includes(savedTheme) ? themeNames.indexOf(savedTheme) : 0;

function ThemeSwitcher(): JSX.Element {
    const [currentTheme, setCurrentTheme] = useState<string>(themeNames[savedThemeIndex]);

    const applyTheme = (theme: Theme) => {
        const root = document.documentElement;
        Object.entries(theme).forEach(([varName, value]) => {
            root.style.setProperty(`--${varName}`, value);
        });
        localStorage.setItem("theme", currentTheme);
    };

    useEffect(() => {
        applyTheme(themes[currentTheme]);
    }, [currentTheme]);

    return (
        <div className="bg-color-1 fixed">
            <select
                name="theme-switcher" defaultValue={savedThemeIndex}
                onChange={(e) => setCurrentTheme(themeNames[Number(e.target.value)])}
            >
                <option value={0}>Dark Blue</option>
                <option value={1}>Dark Green</option>
                <option value={2}>Light Lavender</option>
                <option value={3}>Light Sand</option>
            </select>
        </div>
    );
}

export default ThemeSwitcher;
