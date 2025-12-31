import { signOut } from "@repo/api/auth";
import { LogOut } from "lucide-react";
import type { JSX } from "react";
import { Button, Text } from "tamagui";

function PrivateNavbar(): JSX.Element {
	return (
		<nav className="private-navbar">
			<Button
				scaleIcon={1.5}
				iconAfter={<LogOut />}
				onPress={() => signOut()}
			>
				<Text>Sign Out</Text>
			</Button>
		</nav>
	);
}

export default PrivateNavbar;
