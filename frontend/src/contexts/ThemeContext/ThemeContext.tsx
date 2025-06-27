import { createContext, type Dispatch, type SetStateAction } from "react";

interface ThemeContextType {
    currentTheme: string;
    setCurrentTheme: Dispatch<SetStateAction<string>>;
    currentThemeIndex: number;
    setCurrentThemeIndex: Dispatch<SetStateAction<number>>;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
    undefined
);
