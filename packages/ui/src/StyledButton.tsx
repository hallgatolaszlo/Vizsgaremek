import { Button, ButtonProps } from "tamagui";

export function StyledButton(props: ButtonProps) {
	return (
		<Button
			{...props}
			bg={props.bg ?? "$color4"}
			hoverStyle={{
				bg: "$color5",
				borderColor: "$color8",
				...props.hoverStyle,
			}}
		/>
	);
}
