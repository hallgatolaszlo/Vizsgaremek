import { signOut } from "@repo/api";
import { LogOut } from "@tamagui/lucide-icons";
import type { JSX } from "react";
import { Button, Nav, Text, XStack } from "tamagui";
import { ThemeToggle } from "../ThemeToggle";

function PrivateNavbar(): JSX.Element {
	return (
		<Nav className="private-navbar">
			<XStack>
				<ThemeToggle />
				<Button
					scaleIcon={1.5}
					iconAfter={<LogOut />}
					onPress={async () => {
						await signOut();
						window.location.href = "/sign-in";
					}}
				>
					<Text>Sign Out</Text>
				</Button>
			</XStack>
		</Nav>
	);
}

export default PrivateNavbar;
