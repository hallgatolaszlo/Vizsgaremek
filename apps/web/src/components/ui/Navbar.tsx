import { signOut } from "@repo/api";
import { useAuthStore } from "@repo/hooks";
import { StyledButton } from "@repo/ui";
import { LogIn, LogOut } from "@tamagui/lucide-icons";
import { usePathname, useRouter } from "next/navigation";
import { Nav, Text, XStack } from "tamagui";
import { ThemeToggle } from "./ThemeToggle";

function PublicNavbar() {
	const router = useRouter();
	const pathname = usePathname();

	function handleNavigation() {
		if (pathname === "/sign-in") {
			return;
		}
		router.push("/sign-in");
	}

	return (
		<XStack gap="$2" justify="flex-end">
			<StyledButton
				scaleIcon={1.5}
				iconAfter={<LogIn />}
				onPress={handleNavigation}
			>
				<Text>Sign In / Sign Up</Text>
			</StyledButton>
			<ThemeToggle />
		</XStack>
	);
}

function PrivateNavbar() {
	return (
		<XStack gap="$2" justify="flex-end">
			<StyledButton
				scaleIcon={1.5}
				iconAfter={<LogOut />}
				onPress={async () => {
					await signOut();
					window.location.href = "/sign-in";
				}}
			>
				<Text>Sign Out</Text>
			</StyledButton>
			<ThemeToggle />
		</XStack>
	);
}

export default function Navbar() {
	const isAuthorized = useAuthStore((state) => state.isAuthorized);

	return (
		<Nav
			minH="var(--navbar-height)"
			maxH="var(--navbar-height)"
			p="$2"
			borderBottomWidth={1}
			borderBottomColor="$color7"
			bg="$color2"
		>
			{isAuthorized ? <PrivateNavbar /> : <PublicNavbar />}
		</Nav>
	);
}
