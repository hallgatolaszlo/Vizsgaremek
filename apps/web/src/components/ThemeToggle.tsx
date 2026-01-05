"use client";

import { useThemeSetting } from "@tamagui/next-theme";
import { Moon, Sun } from "@tamagui/lucide-icons";
import { Button } from "tamagui";

export function ThemeToggle() {
	const { resolvedTheme, set } = useThemeSetting();

	return (
		<Button
			circular
			scaleIcon={1.5}
			icon={resolvedTheme === "dark" ? Moon : Sun}
			onPress={() => set(resolvedTheme === "dark" ? "light" : "dark")}
		/>
	);
}
