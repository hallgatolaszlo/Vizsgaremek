import { useContextMenuStore, useDialogStore } from "@repo/hooks";
import { Plus } from "@tamagui/lucide-icons";
import { useState } from "react";
import { Dialog, ListItem, YGroup } from "tamagui";
import { CreateCalendarEntryForm } from "./CreateCalendarEntryForm";

export default function ContextMenu() {
	const [dialogOpen, setDialogOpen] = useState(false);
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
						<ListItem
							height={"100%"}
							icon={<Plus />}
							title="New Event"
							style={{ backgroundColor: "var(--color3)" }}
							hoverStyle={{ bg: "$accent4" }}
							onPress={() => {
								hideMenu();
								setContent(<CreateCalendarEntryForm />);
							}}
						/>
					</Dialog.Trigger>
				</YGroup.Item>
			</YGroup>
		);
	}

	return null;
}
