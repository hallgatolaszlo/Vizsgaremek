import { create } from "zustand";

interface DialogState {
	isDialogOpen: boolean;
	title?: string;
	description?: string;
	content: React.ReactNode;

	setIsDialogOpen: (open: boolean) => void;
	setTitle?: (title: string) => void;
	setDescription?: (description: string) => void;
	setContent: (content: React.ReactNode) => void;
}

export const useDialogStore = create<DialogState>((set) => ({
	isDialogOpen: false,
	title: undefined,
	description: undefined,
	content: undefined,

	setIsDialogOpen: (open: boolean) => set({ isDialogOpen: open }),
	setTitle: (title: string) => set({ title }),
	setDescription: (description: string) => set({ description }),
	setContent: (content: React.ReactNode) => set({ content }),
}));
