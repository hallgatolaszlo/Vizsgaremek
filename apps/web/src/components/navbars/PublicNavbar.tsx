import { LogIn } from "@tamagui/lucide-icons";
import { usePathname, useRouter } from "next/navigation";
import { type JSX } from "react";
import { Button, Nav, Text, XStack } from "tamagui";
import { ThemeToggle } from "../ThemeToggle";

function PublicNavbar(): JSX.Element {
	const router = useRouter();
	const pathname = usePathname();

	function handleNavigation() {
		if (pathname === "/sign-in") {
			return;
		}
		router.push("/sign-in");
	}

	return (
		<Nav className="public-navbar">
			<XStack>
				<ThemeToggle />
				<Button
					scaleIcon={1.5}
					iconAfter={<LogIn />}
					onPress={handleNavigation}
				>
					<Text>Sign In / Sign Up</Text>
				</Button>
			</XStack>
		</Nav>
	);
}

export default PublicNavbar;
