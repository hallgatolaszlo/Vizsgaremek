import { signOut } from "@repo/api";
import { useAuthStore } from "@repo/hooks";
import { StyledButton } from "@repo/ui";
import { LogIn, LogOut } from "@tamagui/lucide-icons";
import { usePathname, useRouter } from "next/navigation";
import { Nav, Separator, Text, XStack, YStack } from "tamagui";
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
        <YStack>
            <XStack gap="$2" p="$2" justify="flex-end">
                <StyledButton
                    scaleIcon={1.5}
                    iconAfter={<LogIn />}
                    onPress={handleNavigation}
                >
                    <Text style={{ userSelect: "none" }}>
                        Sign In / Sign Up
                    </Text>
                </StyledButton>
                <ThemeToggle />
            </XStack>
            <Separator />
        </YStack>
    );
}

function PrivateNavbar() {
    return (
        <YStack>
            <XStack gap="$2" p="$2" justify="flex-end">
                <StyledButton
                    scaleIcon={1.5}
                    iconAfter={<LogOut />}
                    onPress={async () => {
                        await signOut();
                        window.location.href = "/sign-in";
                    }}
                >
                    <Text style={{ userSelect: "none" }}>Sign Out</Text>
                </StyledButton>
                <ThemeToggle />
            </XStack>
            <Separator />
        </YStack>
    );
}

export default function Navbar() {
    const isAuthorized = useAuthStore((state) => state.isAuthorized);

    return (
        <Nav
            minH="var(--navbar-height)"
            maxH="var(--navbar-height)"
            bg="$color2"
            width="100%"
        >
            {isAuthorized ? <PrivateNavbar /> : <PublicNavbar />}
        </Nav>
    );
}
