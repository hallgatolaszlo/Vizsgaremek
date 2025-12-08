import Button from "@mui/material/Button";
import type { JSX } from "react";
import api from "../services/api";

function AuthorizedPage(): JSX.Element {
    async function handleClick() {
        try {
            await api.get("api/auth/protected");
        } catch {
            // Handle error if needed
        }
    }

    return <Button onClick={handleClick}>Check authorization</Button>;
}

export default AuthorizedPage;
