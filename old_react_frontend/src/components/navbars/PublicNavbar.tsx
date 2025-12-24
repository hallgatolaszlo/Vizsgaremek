import Login from "@mui/icons-material/Login";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { type JSX } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

function PublicNavbar(): JSX.Element {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <>
            <nav className="public-navbar">
                <Typography variant="h4"></Typography>
                <Container disableGutters maxWidth={false}>
                    <Button
                        endIcon={<Login />}
                        variant={
                            location.pathname == "/sign-in"
                                ? "contained"
                                : "outlined"
                        }
                        onClick={() => navigate("/sign-in")}
                    >
                        Sign In / Sign Up
                    </Button>
                </Container>
            </nav>
            <main>
                <Outlet />
            </main>
        </>
    );
}

export default PublicNavbar;
