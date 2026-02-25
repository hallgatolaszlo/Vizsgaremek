import { signOut } from "@repo/api";
import { useAuthStore, useCalendarStore } from "@repo/hooks";
import { StyledButton } from "@repo/ui";
import {
	ChevronLeft,
	ChevronRight,
	LogIn,
	LogOut,
} from "@tamagui/lucide-icons";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Avatar, H1, ListItem, Nav, Popover, Text, XStack } from "tamagui";
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
		<XStack
			px={"$4"}
			justify="space-between"
			borderBottomColor={"$color5"}
			borderBottomWidth={2}
		>
			<XStack
				gap={"$4"}
				style={{ display: "flex", alignItems: "center" }}
			>
				<H1 style={{ userSelect: "none" }}>Planova</H1>
			</XStack>
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
				<ThemeToggle circular />
			</XStack>
		</XStack>
	);
}

enum Images {
	Brian = "/Brian.svg",
	Destiny = "/Destiny.svg",
}

function PrivateNavbar() {
	const { setHideSidebar, hideSidebar } = useCalendarStore();
	const [image, setImage] = useState<Images>(Images.Brian);
	const [settingsOpen, setSettingsOpen] = useState(false);

	return (
		<XStack
			px={"$4"}
			py="$2"
			justify="space-between"
			borderBottomColor={"$color5"}
			borderBottomWidth={2}
		>
			<XStack
				gap={"$4"}
				style={{ display: "flex", alignItems: "center" }}
			>
				<StyledButton
					icon={hideSidebar ? <ChevronRight /> : <ChevronLeft />}
					scaleIcon={1.5}
					onPress={() => setHideSidebar(!hideSidebar)}
				/>
				<H1 style={{ userSelect: "none" }}>Planova</H1>
			</XStack>
			<XStack display="none" gap="$2" justify="flex-end">
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
			<Popover
				open={settingsOpen}
				onOpenChange={setSettingsOpen}
				placement="bottom-end"
			>
				<Popover.Trigger asChild>
					<Avatar
						circular
						style={{ userSelect: "none", cursor: "pointer" }}
					>
						<Avatar.Image
							src={settingsOpen ? Images.Destiny : Images.Brian}
						/>
						<Avatar.Fallback backgroundColor="$accent3" />
					</Avatar>
				</Popover.Trigger>
				<Popover.Content
					style={{
						outlineWidth: 2,
						outlineColor: "var(--color5)",
						outlineStyle: "solid",
						borderRadius: 10,
						padding: 3,
						backgroundColor: "var(--color2)",
					}}
					elevate
				>
					<Popover.Arrow
						size="$4"
						borderWidth={2}
						borderColor="$color6"
						bg="$color2"
					/>
					<ListItem
						p={0}
						style={{
							borderTopLeftRadius: 10,
							borderTopRightRadius: 10,
						}}
					>
						<ThemeToggle />
					</ListItem>
					<ListItem
						p={0}
						style={{
							borderBottomLeftRadius: 10,
							borderBottomRightRadius: 10,
						}}
					>
						<StyledButton
							width={"100%"}
							bg={"$color2"}
							hoverStyle={{
								bg: "$color3",
								outlineWidth: 0,
							}}
							style={{
								display: "flex",
								justifyContent: "space-between",
							}}
							scaleIcon={1.5}
							iconAfter={<LogOut />}
							onPress={async () => {
								await signOut();
								window.location.href = "/sign-in";
							}}
						>
							<Text style={{ userSelect: "none" }}>Sign Out</Text>
						</StyledButton>
					</ListItem>
				</Popover.Content>
			</Popover>
		</XStack>
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
