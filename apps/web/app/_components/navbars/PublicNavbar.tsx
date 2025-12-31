import { LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { type JSX } from "react";
import { Button, Text } from "tamagui";

function PublicNavbar(): JSX.Element {
	const router = useRouter();

	function handleNavigation() {
		router.push("/sign-in");
	}

	return (
		<nav className="public-navbar">
			<Button
				scaleIcon={1.5}
				iconAfter={<LogIn />}
				onPress={handleNavigation}
			>
				<Text>Sign In / Sign Up</Text>
			</Button>
		</nav>
	);
}

export default PublicNavbar;
