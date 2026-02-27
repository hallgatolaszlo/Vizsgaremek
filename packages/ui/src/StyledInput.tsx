import { Input, InputProps } from "tamagui";

interface StyledInputProps extends InputProps {
	ref?: React.RefObject<any> | React.RefCallback<any>;
}

// Styled Input component with hover and focus styles
export function StyledInput(props: StyledInputProps) {
	return (
		<Input
			{...props}
			hoverStyle={{ borderColor: "$color8" }}
			focusStyle={{
				outlineWidth: 2,
				outlineOffset: -2,
				outlineColor: "$accent9",
				outlineStyle: "solid",
			}}
			ref={props.ref}
		/>
	);
}
