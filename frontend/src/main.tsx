import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { ThemeProvider } from "./contexts/ThemeContext/ThemeProvider.tsx";
import "./css/index.css";
import { AuthProvider } from "./contexts/AuthContext/AuthProvider.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <AuthProvider>
            <ThemeProvider>
                <App />
            </ThemeProvider>
        </AuthProvider>
    </StrictMode>
);
