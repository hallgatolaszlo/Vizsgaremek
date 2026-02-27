import { useContextMenuStore } from "@repo/hooks";
import { StyledButton } from "@repo/ui";
import { Plus } from "@tamagui/lucide-icons";
import { useState } from "react";
import { Dialog, Text, YGroup } from "tamagui";
import { CreateCalendarEntryForm } from "./CreateCalendarEntryForm";
import CustomDialog from "./CustomDialog";

export default function ContextMenu() {
	const [isDialogOpen, setIsDialogOpen] = useState(false);

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
					<CustomDialog
						isDialogOpen={isDialogOpen}
						setIsDialogOpen={setIsDialogOpen}
						onPointerDownOutside={(e) => e.preventDefault()}
						content={
							<CreateCalendarEntryForm
								onClose={() => setIsDialogOpen(false)}
							/>
						}
					>
						<Dialog.Trigger asChild>
							<StyledButton
								height={"100%"}
								icon={<Plus />}
								style={{ backgroundColor: "var(--color3)" }}
								hoverStyle={{ bg: "$accent4" }}
								onPress={() => {
									hideMenu();
								}}
							>
								<Text style={{ userSelect: "none" }}>
									New Event
								</Text>
							</StyledButton>
						</Dialog.Trigger>
					</CustomDialog>
				</YGroup.Item>
			</YGroup>
		);
	}

	return null;
}
