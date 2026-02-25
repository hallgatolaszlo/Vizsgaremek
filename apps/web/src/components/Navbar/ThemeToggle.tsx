"use client";

import { StyledButton } from "@repo/ui";
import { Moon, Sun } from "@tamagui/lucide-icons";
import { useThemeSetting } from "@tamagui/next-theme";
import { Switch, XStack } from "tamagui";

export function ThemeToggle({ circular = false }: { circular?: boolean }) {
	const { resolvedTheme, set } = useThemeSetting();

	if (circular) {
		return (
			<StyledButton
				circular
				style={{
					display: "flex",
					justifyContent: "center",
				}}
				scaleIcon={1.5}
				icon={resolvedTheme === "dark" ? Moon : Sun}
				onPress={() => {
					set(resolvedTheme === "dark" ? "light" : "dark");
				}}
			></StyledButton>
		);
	}

	return (
		<XStack
			style={{
				display: "flex",
				alignItems: "center",
				gap: 8,
				padding: 4,
			}}
		>
			<Sun />
			<Switch
				checked={resolvedTheme === "dark"}
				onPress={() => {
					set(resolvedTheme === "dark" ? "light" : "dark");
				}}
				size="$4"
			>
				<Switch.Thumb animation="bouncy" />
			</Switch>
			<Moon />
		</XStack>
	);
}
