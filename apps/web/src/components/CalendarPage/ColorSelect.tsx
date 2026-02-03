import { ColorIcon, SelectElement } from "@repo/ui";
import { useRef, useState } from "react";
import { Select, useTheme, View } from "tamagui";

function ColorSelectItem({ color, index }: { color: any; index: number }) {
	const [isHovered, setIsHovered] = useState(false);

	return (
		<Select.Item
			unstyled
			index={index}
			value={(index + 1).toString()}
			flexBasis={0}
			style={
				isHovered
					? {
							outlineWidth: 2,
							outlineOffset: -2,
							outlineColor: "var(--accent9)",
							outlineStyle: "solid",
							borderRadius: 9,
						}
					: {}
			}
			onHoverIn={() => setIsHovered(true)}
			onHoverOut={() => setIsHovered(false)}
		>
			<Select.ItemText>
				<ColorIcon color={color.val} />
			</Select.ItemText>
		</Select.Item>
	);
}

export default function ColorSelect({
	value,
	onChange,
}: {
	value: number;
	onChange: (value: number) => void;
}) {
	const theme = useTheme({ name: "calendarColors" });
	const colors = useRef<Record<string, any>>({
		"1": theme.color1,
		"2": theme.color2,
		"3": theme.color3,
		"4": theme.color4,
		"5": theme.color5,
		"6": theme.color6,
		"7": theme.color7,
		"8": theme.color8,
		"9": theme.color9,
		"10": theme.color10,
		"11": theme.color11,
		"12": theme.color12,
	});

	return (
		<View>
			<SelectElement
				value={value.toString()}
				onValueChange={(value) => onChange(Number(value))}
				renderValue={(value) => (
					<View
						style={{
							width: 20,
							height: 20,
							backgroundColor: colors.current[value].val,
							borderRadius: "5.5px",
						}}
					></View>
				)}
				triggerPlaceholder=""
				groupItems={Object.values(colors.current).map((color, i) => (
					<ColorSelectItem key={i} color={color} index={i} />
				))}
				groupStyle={{
					display: "grid",
					gridTemplateColumns: "1fr 1fr 1fr 1fr",
				}}
			/>
		</View>
	);
}
