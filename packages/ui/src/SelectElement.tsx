import { Select, SelectProps, SelectScopedProps } from "tamagui";

interface SelectElementProps extends SelectProps {
	groupItems: React.ReactNode;
	triggerStyle?: React.CSSProperties;
	groupStyle?: React.CSSProperties;
	valueStyle?: React.CSSProperties;
	disabled?: boolean;
}

export function SelectElement(props: SelectScopedProps<SelectElementProps>) {
	const {
		value,
		onValueChange,
		renderValue,
		groupItems,
		triggerStyle,
		groupStyle,
		valueStyle,
		disabled = false,
	} = props;

	return (
		<Select
			value={value}
			onValueChange={onValueChange}
			disablePreventBodyScroll
			// renderValue enables SSR support by providing the label synchronously
			renderValue={renderValue}
		>
			<Select.Trigger disabled={disabled} style={{ ...triggerStyle }}>
				<Select.Value
					style={{
						...valueStyle,
					}}
				/>
			</Select.Trigger>

			<Select.FocusScope enabled={false}>
				<Select.Content zIndex={200000}>
					<Select.Viewport
						style={{
							overflowY: "auto",
							scrollbarWidth: "thin",
							scrollbarColor: "var(--accent5) transparent",
						}}
					>
						<Select.Group
							style={{
								...groupStyle,
								overflowY: "auto",
								maxHeight: "calc(100vh - 200px)",
							}}
						>
							{groupItems}
						</Select.Group>
					</Select.Viewport>
				</Select.Content>
			</Select.FocusScope>
		</Select>
	);
}
