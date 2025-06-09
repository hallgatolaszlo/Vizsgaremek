import { useContext } from "react";
import { ThemeContext } from "./ThemeContext";

export const useTheme = () => {
    const ctx = useContext(ThemeContext);
    if (!ctx) {
        throw new Error("useThemeContext must be used within an ThemeProvider");
    }
    return ctx;
};
