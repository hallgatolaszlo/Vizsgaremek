import { Select, SelectProps, SelectScopedProps } from "tamagui";

interface SelectElementProps extends SelectProps {
	triggerPlaceholder: string;
	groupItems: React.ReactNode;
	triggerStyle?: React.CSSProperties;
	groupStyle?: React.CSSProperties;
}

export function SelectElement(props: SelectScopedProps<SelectElementProps>) {
	const {
		value,
		onValueChange,
		renderValue,
		triggerPlaceholder,
		groupItems,
		triggerStyle,
		groupStyle,
	} = props;

	return (
		<Select
			value={value}
			onValueChange={onValueChange}
			disablePreventBodyScroll
			// renderValue enables SSR support by providing the label synchronously
			renderValue={renderValue}
		>
			<Select.Trigger flex={1} minWidth={0} style={{ ...triggerStyle }}>
				<Select.Value placeholder={triggerPlaceholder} />
			</Select.Trigger>

			<Select.Content zIndex={200000}>
				<Select.Viewport>
					<Select.Group
						style={{
							...groupStyle,
						}}
					>
						{groupItems}
					</Select.Group>
				</Select.Viewport>
			</Select.Content>
		</Select>
	);
}
