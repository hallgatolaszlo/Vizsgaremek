import { Dialog, VisuallyHidden } from "tamagui";

interface CustomDialog {
	isDialogOpen: boolean;
	setIsDialogOpen: (open: boolean) => void;
	title?: string | undefined;
	description?: string | undefined;
	content?: React.ReactNode;
	children?: React.ReactNode;
	onPointerDownOutside?: (e: PointerDownOutsideEvent) => void;
	transparent?: boolean;
}

type PointerDownOutsideEvent = CustomEvent<{ originalEvent: PointerEvent }>;

export default function CustomDialog({
	isDialogOpen,
	setIsDialogOpen,
	title,
	description,
	content,
	children,
	onPointerDownOutside,
	transparent,
}: CustomDialog) {
	return (
		<Dialog
			modal
			open={isDialogOpen}
			onOpenChange={setIsDialogOpen}
			scope="custom-dialog"
			disableRemoveScroll
		>
			{isDialogOpen && (
				<Dialog.Portal key={"dialogportal"}>
					<Dialog.Overlay
						key={"dialogoverlay"}
						bg={transparent ? "transparent" : "$shadow6"}
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
					<Dialog.Content
						tabIndex={10000}
						key={"dialogcontent"}
						onPointerDownOutside={onPointerDownOutside}
						style={{
							maxHeight: "90vh",
							overflowY: "auto",
							overflowX: "hidden",
						}}
					>
						<Dialog.Title key={"dialogtitle"}>
							{title ? (
								title
							) : (
								<VisuallyHidden>{title}</VisuallyHidden>
							)}
						</Dialog.Title>
						<Dialog.Description key={"dialogdescription"}>
							{description ? (
								description
							) : (
								<VisuallyHidden>{description}</VisuallyHidden>
							)}
						</Dialog.Description>
						{content}
					</Dialog.Content>
				</Dialog.Portal>
			)}
			{children}
		</Dialog>
	);
}
