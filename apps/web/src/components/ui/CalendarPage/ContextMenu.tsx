import { useContextMenuStore } from "@repo/hooks";
import { Plus } from "@tamagui/lucide-icons";
import { Dialog, ListItem, YGroup } from "tamagui";

export default function ContextMenu() {
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
					<Dialog.Trigger scope="create-calendar-event" asChild>
						<ListItem
							height={"100%"}
							icon={<Plus />}
							title="New Event"
							style={{ backgroundColor: "var(--color3)" }}
							hoverStyle={{ bg: "$accent4" }}
							onPress={() => {
								hideMenu();
							}}
						/>
					</Dialog.Trigger>
				</YGroup.Item>
			</YGroup>
		);
	}

	return null;
}
