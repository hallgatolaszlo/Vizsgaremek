"use client";

import { StyledButton } from "@repo/ui";
import { Moon, Sun } from "@tamagui/lucide-icons";
import { useThemeSetting } from "@tamagui/next-theme";
import { Text } from "tamagui";

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
			iconAfter={resolvedTheme === "dark" ? Moon : Sun}
			onPress={() => {
				set(resolvedTheme === "dark" ? "light" : "dark");
			}}
		>
			<Text style={{ userSelect: "none" }}>
				{resolvedTheme === "dark" ? "Dark Mode" : "Light Mode"}
			</Text>
		</StyledButton>
	);
}
