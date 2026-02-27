import { TextArea, TextAreaProps } from "tamagui";

export function StyledTextArea(props: TextAreaProps) {
	return (
		<TextArea
			{...props}
			hoverStyle={{ borderColor: "$color8" }}
			focusStyle={{
				outlineWidth: 2,
				outlineOffset: -2,
				outlineColor: "$accent9",
				outlineStyle: "solid",
			}}
		/>
	);
}
