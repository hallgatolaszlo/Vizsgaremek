import Logout from "@mui/icons-material/Logout";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import type { JSX } from "react";
import { Outlet } from "react-router-dom";
import { signOut } from "../../services/api";

function PrivateLayout(): JSX.Element {
    return (
        <>
            <nav className="private-navbar">
                <Typography variant="h4"></Typography>
                <Container disableGutters maxWidth={false}>
                    <Button
                        endIcon={<Logout />}
                        variant="outlined"
                        onClick={signOut}
                    >
                        Sign Out
                    </Button>
                </Container>
            </nav>
            <main>
                <Outlet />
            </main>
        </>
    );
}

export default PrivateLayout;
