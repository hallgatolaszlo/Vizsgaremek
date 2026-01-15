import { Text } from "tamagui";

// Component for ToggleGroup Item Text to avoid console errors
export const ToggleGroupItemText = ({ text }: { text: string }) => {
	return <Text>{text}</Text>;
};
