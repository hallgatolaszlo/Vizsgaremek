import Logout from "@mui/icons-material/Logout";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { signOut } from "@repo/api/auth";
import type { JSX } from "react";

function PrivateLayout(): JSX.Element {
	return (
		<nav className="private-navbar">
			<Typography variant="h4"></Typography>
			<Container disableGutters maxWidth={false}>
				<Button
					endIcon={<Logout />}
					variant="outlined"
					onClick={() => signOut()}
				>
					Sign Out
				</Button>
			</Container>
		</nav>
	);
}

export default PrivateLayout;
