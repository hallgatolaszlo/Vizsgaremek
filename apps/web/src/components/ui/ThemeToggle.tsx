"use client";

import { StyledButton } from "@repo/ui";
import { Moon, Sun } from "@tamagui/lucide-icons";
import { useThemeSetting } from "@tamagui/next-theme";

export function ThemeToggle() {
	const { resolvedTheme, set } = useThemeSetting();

	function ThemeToggleButton() {
		return (
			<StyledButton
				circular
				scaleIcon={1.5}
				icon={resolvedTheme === "dark" ? Moon : Sun}
				onPress={() => set(resolvedTheme === "dark" ? "light" : "dark")}
			/>
		);
	}

	return <ThemeToggleButton />;
}
