import {useState, useEffect, type JSX} from "react";
import {themes, type Theme} from "../themes/themes.ts";

const themeNames = Object.keys(themes);

function ThemeSwitcher(): JSX.Element {
    const [currentTheme, setCurrentTheme] = useState<string>(themeNames[0]);

    // Function to apply a theme by setting CSS variables on :root
    const applyTheme = (theme: Theme) => {
        const root = document.documentElement;
        Object.entries(theme).forEach(([varName, value]) => {
            root.style.setProperty(`--${varName}`, value);
        });
    };

    useEffect(() => {
        applyTheme(themes[currentTheme]);
    }, [currentTheme]);

    const switchTheme = (selectedTheme: number) => {
        setCurrentTheme(themeNames[selectedTheme]);
    };

    return (
        <select
            onChange={(e) => switchTheme(Number(e.target.value))}
        >
            <option value={0}>Dark Blue</option>
            <option value={1}>Dark Green</option>
            <option value={2}>Light Lavender</option>
            <option value={3}>Light Sand</option>
        </select>
    );
}

export default ThemeSwitcher;
