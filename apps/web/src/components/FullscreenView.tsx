import { View, ViewProps, XStack, YStack } from "tamagui";

interface FullscreenViewProps extends ViewProps {
	children: React.ReactNode;
	stack?: "XStack" | "YStack";
	maxHeight?: boolean;
}

export function FullscreenView(props: FullscreenViewProps) {
	const { children, stack, maxHeight, ...rest } = props;
	const height = `calc(100vh - var(--navbar-height))`;

	if (stack === "XStack") {
		return (
			<XStack
				style={{
					minHeight: height,
					maxHeight: maxHeight ? height : undefined,
				}}
				{...rest}
			>
				{children}
			</XStack>
		);
	}
	if (stack === "YStack") {
		return (
			<YStack
				style={{
					minHeight: height,
					maxHeight: maxHeight ? height : undefined,
				}}
				{...rest}
			>
				{children}
			</YStack>
		);
	}

	return (
		<View
			style={{
				minHeight: height,
				maxHeight: maxHeight ? height : undefined,
			}}
			{...rest}
		>
			{children}
		</View>
	);
}
