import { createContext, type Dispatch, type SetStateAction } from "react";

interface ThemeContextType {
    currentTheme: string;
    setCurrentTheme: Dispatch<SetStateAction<string>>;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
    undefined
);
