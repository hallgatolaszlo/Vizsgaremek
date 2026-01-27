import { Button, ButtonProps } from "tamagui";

// Styled Button component with default and hover styles
export function StyledButton(props: ButtonProps) {
	return (
		<Button
			{...props}
			bg={props.bg ?? "$color4"}
			hoverStyle={{
				bg: "$accent5",
				borderColor: "$color8",
				...props.hoverStyle,
			}}
		/>
	);
}
