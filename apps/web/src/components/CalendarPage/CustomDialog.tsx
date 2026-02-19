import { Dialog, VisuallyHidden } from "tamagui";

interface CustomDialog {
    isDialogOpen: boolean;
    setIsDialogOpen: (open: boolean) => void;
    title?: string | undefined;
    description?: string | undefined;
    content?: React.ReactNode;
    children?: React.ReactNode;
}

export default function CustomDialog({
    isDialogOpen,
    setIsDialogOpen,
    title,
    description,
    content,
    children,
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
