import { type JSX } from "react";
import { useTheme } from "../contexts/ThemeContext/UseTheme";

function ThemeSwitcher(): JSX.Element {
    const { currentTheme, setCurrentTheme } = useTheme();

    return (
        <div className="bg-color-1">
            <select
                name="theme-switcher"
                defaultValue={currentTheme}
                onChange={(e) => setCurrentTheme(e.target.value)}
            >
                <option value="darkBlue">Dark Blue</option>
                <option value="darkGreen">Dark Green</option>
                <option value="lightLavender">Light Lavender</option>
                <option value="lightSand">Light Sand</option>
            </select>
        </div>
    );
}

export default ThemeSwitcher;
