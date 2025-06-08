import './css/App.css';
import LoginPage from "./pages/LoginPage.tsx";
import {type JSX} from "react";
import ThemeSwitcher from "./components/ThemeSwitcher.tsx";

function App(): JSX.Element {

    return (
        <>
            <ThemeSwitcher/>
            <LoginPage/>
        </>
    );
}

export default App;
