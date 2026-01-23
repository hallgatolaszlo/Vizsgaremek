import { Input, InputProps } from "tamagui";

interface StyledInputProps extends InputProps {
	ref: React.RefObject<any> | React.RefCallback<any>;
}

// Styled Input component with hover and focus styles
export function StyledInput(props: StyledInputProps) {
	return (
		<Input
			{...props}
			hoverStyle={{ borderColor: "$color8" }}
			focusStyle={{
				outlineStyle: "none",
				borderWidth: 2,
				borderColor: "$color8",
			}}
			ref={props.ref}
		/>
	);
}
