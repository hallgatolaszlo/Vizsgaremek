import Login from "@mui/icons-material/Login";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type JSX } from "react";

function PublicNavbar(): JSX.Element {
	const pathname = usePathname();

	return (
		<nav className="public-navbar">
			<Typography variant="h4"></Typography>
			<Container disableGutters maxWidth={false}>
				<Link href="/sign-in">
					<Button
						endIcon={<Login />}
						variant={
							pathname.endsWith("/sign-in")
								? "contained"
								: "outlined"
						}
					>
						Sign In / Sign Up
					</Button>
				</Link>
			</Container>
		</nav>
	);
}

export default PublicNavbar;
