import { View, ViewProps, XStack, YStack } from "tamagui";

interface FullscreenViewProps extends ViewProps {
	children: React.ReactNode;
	stack?: "XStack" | "YStack";
}

export function FullscreenView(props: FullscreenViewProps) {
	const { children, stack, ...rest } = props;

	const height = `calc(100vh - var(--navbar-height))`;

	if (stack === "XStack") {
		return (
			<XStack minH={height} {...rest}>
				{children}
			</XStack>
		);
	}
	if (stack === "YStack") {
		return (
			<YStack minH={height} {...rest}>
				{children}
			</YStack>
		);
	}

	return (
		<View minH={height} {...rest}>
			{children}
		</View>
	);
}
