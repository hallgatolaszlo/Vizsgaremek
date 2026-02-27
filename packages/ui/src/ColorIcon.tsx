import React from "react";
import { View } from "tamagui";

export function ColorIcon({
	color,
	style,
}: {
	color: string;
	style?: React.CSSProperties;
}) {
	return (
		<View
			style={{
				...style,
				width: 20,
				height: 20,
				backgroundColor: color,
				borderRadius: "5.5px",
			}}
		/>
	);
}
