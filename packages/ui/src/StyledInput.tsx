import { Input, InputProps } from "tamagui";

interface StyledInputProps extends InputProps {
	ref: React.RefObject<any> | React.RefCallback<any>;
}

export function StyledInput(props: StyledInputProps) {
	return (
		<Input
			{...props}
			hoverStyle={{ borderColor: "$color8" }}
			focusStyle={{
				outlineStyle: "none",
				borderWidth: 2,
				borderColor: "$color7",
			}}
			ref={props.ref}
		/>
	);
}
