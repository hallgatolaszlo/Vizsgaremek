import { CreateCalendarEntryForm } from "@repo/features";
import { Dialog, VisuallyHidden } from "tamagui";

interface CreateCalendarEntryDialogProps {
	dialogOpen: boolean;
	setDialogOpen: (open: boolean) => void;
	children: React.ReactNode;
}

export default function CreateCalendarEntryDialog({
	dialogOpen,
	setDialogOpen,
	children,
}: CreateCalendarEntryDialogProps) {
	return (
		<Dialog
			modal
			open={dialogOpen}
			onOpenChange={setDialogOpen}
			scope="create-calendar-event"
			disableRemoveScroll
		>
			{dialogOpen && (
				<Dialog.Portal key={"dialogportal"}>
					<Dialog.Overlay
						key={"dialogoverlay"}
						bg="$shadow6"
						animateOnly={["transform", "opacity"]}
						animation={[
							"quicker",
							{
								opacity: {
									overshootClamping: true,
								},
							},
						]}
						enterStyle={{ opacity: 0 }}
						exitStyle={{ opacity: 0 }}
					/>
					<Dialog.Content key={"dialogcontent"}>
						<Dialog.Title key={"dialogtitle"}>
							<VisuallyHidden>
								Create Calendar Event
							</VisuallyHidden>
						</Dialog.Title>
						<Dialog.Description key={"dialogdescription"}>
							<VisuallyHidden>
								Create Calendar Event Dialog
							</VisuallyHidden>
						</Dialog.Description>
						<CreateCalendarEntryForm />
					</Dialog.Content>
				</Dialog.Portal>
			)}
			{children}
		</Dialog>
	);
}
