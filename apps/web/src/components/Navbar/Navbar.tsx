import { signOut } from "@repo/api";
import {
	useAuthStore,
	useCalendarStore,
	useNavbarStore,
	useProfileStore,
} from "@repo/hooks";
import { WeekStartDay } from "@repo/types";
import { StyledButton, ToggleGroupItemText } from "@repo/ui";
import { LogIn, LogOut, Menu } from "@tamagui/lucide-icons";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";
import {
	Avatar,
	Button,
	GetProps,
	H1,
	Image,
	ListItem,
	Nav,
	Popover,
	Separator,
	Text,
	ToggleGroup,
	XGroup,
	XStack,
	YStack,
} from "tamagui";
import { ThemeToggle } from "./ThemeToggle";

enum Images {
	Brian = "/Brian.svg",
	Destiny = "/Destiny.svg",
	Logo = "/Logo.png",
}

type AnimationProp = GetProps<typeof YStack>["animation"];
const FADE_ANIMATION: AnimationProp = "quick";

async function handleSignOut() {
	await signOut();
	window.location.href = "/sign-in";
}

function getToggleItemStyles(isActive: boolean) {
	return {
		backgroundColor: isActive ? "$color4" : "$color2",
		focusStyle: { backgroundColor: "$color4" },
		hoverStyle: {
			cursor: isActive ? "default" : "pointer",
			backgroundColor: isActive ? "$color4" : "$color3",
			borderColor: isActive ? "$color5" : "$color7",
		},
	} as const;
}

function SettingsItem({
	label,
	children,
}: {
	label: string;
	children: ReactNode;
}) {
	return (
		<ListItem
			p={0}
			style={{
				display: "flex",
				alignItems: "center",
				borderTopLeftRadius: 10,
				borderTopRightRadius: 10,
				gap: 5,
			}}
		>
			<YStack style={{ alignItems: "center", gap: 10 }}>
				<Text
					style={{
						userSelect: "none",
						fontSize: 14,
						color: "var(--color11)",
					}}
				>
					{label}
				</Text>
				{children}
			</YStack>
		</ListItem>
	);
}

interface BinaryToggleOption {
	value: string;
	label: string;
}

interface BinaryToggleProps {
	value: string;
	onValueChange: (value: string) => void;
	options: [BinaryToggleOption, BinaryToggleOption];
}

function BinaryToggle({
	value,
	onValueChange,
	options: [first, second],
}: BinaryToggleProps) {
	return (
		<ToggleGroup
			disableDeactivation
			value={value}
			onValueChange={(v) => v && onValueChange(v)}
			type="single"
		>
			<XGroup
				style={{
					borderWidth: 1,
					borderColor: "var(--color7)",
					borderRadius: 8,
				}}
			>
				<XGroup.Item>
					<ToggleGroup.Item
						{...getToggleItemStyles(value === first.value)}
						value={first.value}
					>
						<ToggleGroupItemText text={first.label} />
					</ToggleGroup.Item>
				</XGroup.Item>
				<Separator
					vertical
					style={{ borderWidth: 1, borderColor: "var(--color4)" }}
				/>
				<XGroup.Item>
					<ToggleGroup.Item
						{...getToggleItemStyles(value === second.value)}
						value={second.value}
					>
						<ToggleGroupItemText text={second.label} />
					</ToggleGroup.Item>
				</XGroup.Item>
			</XGroup>
		</ToggleGroup>
	);
}

function PublicNavbar() {
	const router = useRouter();
	const pathname = usePathname();

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
					onPress={() =>
						pathname !== "/sign-in" && router.push("/sign-in")
					}
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

function PrivateNavbar() {
	const { setHideSidebar, hideSidebar } = useCalendarStore();
	const { isSettingsOpen, setIsSettingsOpen } = useNavbarStore();
	const { weekStartsOn, setWeekStartsOn, hour12, setHour12 } =
		useProfileStore();

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
				<Button
					unstyled
					icon={Menu}
					scaleIcon={1.5}
					onPress={() => setHideSidebar(!hideSidebar)}
					size="$3"
					borderWidth={0}
					bg="transparent"
					aspectRatio={1}
					display="flex"
					style={{
						borderTopLeftRadius: "50%",
						borderBottomLeftRadius: "50%",
						borderTopRightRadius: "50%",
						borderBottomRightRadius: "50%",
						alignItems: "center",
						justifyContent: "center",
					}}
					cursor="pointer"
					hoverStyle={{ bg: "$color3" }}
					animation={FADE_ANIMATION}
				/>
				<XStack
					style={{ display: "flex", alignItems: "center", gap: 10 }}
				>
					<Image src={Images.Logo} width={42} height={42} />
					<H1 style={{ userSelect: "none" }}>Planova</H1>
				</XStack>
			</XStack>
			<Popover
				open={isSettingsOpen}
				onOpenChange={setIsSettingsOpen}
				placement="bottom-end"
			>
				<Popover.Trigger asChild>
					<Avatar
						circular
						style={{ userSelect: "none", cursor: "pointer" }}
					>
						<Avatar.Image
							src={isSettingsOpen ? Images.Destiny : Images.Brian}
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
						backgroundColor: "var(--color2)",
					}}
					enterStyle={{ y: -10, opacity: 0 }}
					exitStyle={{ y: -10, opacity: 0 }}
					elevate
					animation={"75ms"}
				>
					<Popover.Arrow
						size="$4"
						borderWidth={2}
						borderColor="$color6"
						bg="$color2"
					/>
					<YStack gap={10}>
						<SettingsItem label="Theme">
							<ThemeToggle />
						</SettingsItem>
						<SettingsItem label="Week Start Day">
							<BinaryToggle
								value={weekStartsOn}
								onValueChange={(v) =>
									setWeekStartsOn(v as WeekStartDay)
								}
								options={[
									{ value: "monday", label: "Monday" },
									{ value: "sunday", label: "Sunday" },
								]}
							/>
						</SettingsItem>
						<SettingsItem label="Hour Format">
							<BinaryToggle
								value={hour12 ? "true" : "false"}
								onValueChange={(v) => setHour12(v === "true")}
								options={[
									{ value: "true", label: "12-hour" },
									{ value: "false", label: "24-hour" },
								]}
							/>
						</SettingsItem>
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
								hoverStyle={{ bg: "$color3", outlineWidth: 0 }}
								style={{
									display: "flex",
									justifyContent: "space-between",
									borderTopColor: "var(--color6)",
									borderTopWidth: 1,
									borderTopStyle: "solid",
									borderRightColor: "var(--color6)",
									borderRightWidth: 1,
									borderRightStyle: "solid",
									borderBottomColor: "var(--color6)",
									borderBottomWidth: 1,
									borderBottomStyle: "solid",
									borderLeftColor: "var(--color6)",
									borderLeftWidth: 1,
									borderLeftStyle: "solid",
								}}
								scaleIcon={1.5}
								iconAfter={<LogOut />}
								onPress={handleSignOut}
							>
								<Text style={{ userSelect: "none" }}>
									Sign Out
								</Text>
							</StyledButton>
						</ListItem>
					</YStack>
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
