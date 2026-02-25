import { useContextMenuStore, useDialogStore } from "@repo/hooks";
import { StyledButton } from "@repo/ui";
import { Plus } from "@tamagui/lucide-icons";
import { Dialog, Text, YGroup } from "tamagui";
import { CreateCalendarEntryForm } from "./CreateCalendarEntryForm";

export default function ContextMenu() {
	const { setContent } = useDialogStore();

	const {
		display,
		position,
		menuHeight,
		menuWidth,
		fieldType: type,
		hideMenu,
	} = useContextMenuStore();

	if (type === "cell") {
		return (
			<YGroup
				width={menuWidth}
				height={menuHeight}
				position="absolute"
				display={display}
				style={{
					zIndex: 1000,
					left: position.x,
					top: position.y,
				}}
			>
				<YGroup.Item>
					<Dialog.Trigger asChild scope="custom-dialog">
						<StyledButton
							height={"100%"}
							icon={<Plus />}
							style={{ backgroundColor: "var(--color3)" }}
							hoverStyle={{ bg: "$accent4" }}
							onPress={() => {
								hideMenu();
								setContent(<CreateCalendarEntryForm />);
							}}
						>
							<Text style={{ userSelect: "none" }}>
								New Event
							</Text>
						</StyledButton>
					</Dialog.Trigger>
				</YGroup.Item>
			</YGroup>
		);
	}

	return null;
}
