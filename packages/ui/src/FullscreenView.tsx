import { View, XStack, YStack } from "tamagui";

interface FullscreenViewProps {
	children: React.ReactNode;
	stack?: "XStack" | "YStack";
}

export function FullscreenView({ children, stack }: FullscreenViewProps) {
	const height = `calc(100vh - var(--navbar-height))`;

	if (stack === "XStack") {
		return <XStack minH={height}>{children}</XStack>;
	}
	if (stack === "YStack") {
		return <YStack minH={height}>{children}</YStack>;
	}

	return <View minH={height}>{children}</View>;
}
