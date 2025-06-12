import { useContext } from "react";
import { AuthContext } from "./AuthContext";

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useThemeContext must be used within an ThemeProvider");
    }
    return ctx;
};
