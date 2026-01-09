import { Button, ButtonProps } from "tamagui";

export function StyledButton(props: ButtonProps) {
	return (
		<Button
			{...props}
			bg={props.bg ?? "$color3"}
			hoverStyle={{
				bg: "$color4",
				borderColor: "$color8",
				...props.hoverStyle,
			}}
		/>
	);
}
