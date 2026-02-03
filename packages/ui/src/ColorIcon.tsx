import { View } from "tamagui";

export function ColorIcon({ color }: { color: string }) {
	return (
		<View
			style={{
				width: 20,
				height: 20,
				backgroundColor: color,
				borderRadius: "5.5px",
			}}
		/>
	);
}
