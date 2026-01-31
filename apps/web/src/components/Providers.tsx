"use client";

import { config } from "@repo/config";
import { useAuthStore, useContextMenuStore, useDialogStore } from "@repo/hooks";
import { NextThemeProvider, useRootTheme } from "@tamagui/next-theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { OrbitProgress } from "react-loading-indicators";
import { TamaguiProvider, View } from "tamagui";
import ContextMenu from "./CalendarPage/ContextMenu";
import CustomDialog from "./CalendarPage/CustomDialog";
import Navbar from "./Navbar/Navbar";

function MainView({ children }: { children: React.ReactNode }) {
	const viewRef = useRef<HTMLDivElement>(null);
	const {
		contextMenuOpen,
		position,
		menuWidth,
		menuHeight,
		setPosition,
		showMenu,
		hideMenu,
		setFieldType,
	} = useContextMenuStore();

	const { isDialogOpen, setIsDialogOpen, title, description, content } =
		useDialogStore();

	// Store position in a ref to access current value in event handlers
	const positionRef = useRef(position);
	const isOpenRef = useRef(contextMenuOpen);

	useEffect(() => {
		positionRef.current = position;
	}, [position]);

	useEffect(() => {
		isOpenRef.current = contextMenuOpen;
	}, [contextMenuOpen]);

	useEffect(() => {
		const element = viewRef.current;
		if (!element) return;

		function clickedOutside(e: MouseEvent) {
			const pos = positionRef.current;
			if (e.pageX < pos.x || e.pageX > pos.x + menuWidth) {
				return true;
			}
			if (e.pageY < pos.y || e.pageY > pos.y + menuHeight) {
				return true;
			}
			return false;
		}

		function handleContextMenu(e: MouseEvent) {
			e.preventDefault();
		}

		function rightClick(e: MouseEvent) {
			if (clickedOutside(e) && isOpenRef.current) {
				hideMenu();
			}

			if (isOpenRef.current && !clickedOutside(e)) {
				e.preventDefault();
				e.stopPropagation();
				return;
			}

			if (e.button === 2) {
				e.preventDefault();
				e.stopPropagation();
				setFieldType(null);

				let posX = e.pageX;
				let posY = e.pageY;

				if (posX + menuWidth > window.innerWidth) {
					posX = window.innerWidth - menuWidth;
				}

				if (posY + menuHeight > window.innerHeight) {
					posY = window.innerHeight - menuHeight;
				}

				setPosition({ x: posX, y: posY });
				showMenu();
			}
		}

		element.addEventListener("contextmenu", handleContextMenu);
		element.addEventListener("mousedown", rightClick);

		// Cleanup event listeners
		return () => {
			element.removeEventListener("contextmenu", handleContextMenu);
			element.removeEventListener("mousedown", rightClick);
		};
	}, [menuWidth, menuHeight, hideMenu, setPosition, showMenu, setFieldType]);

	return (
		<View background="$color1" ref={viewRef}>
			<CustomDialog
				isDialogOpen={isDialogOpen}
				setIsDialogOpen={setIsDialogOpen}
				title={title}
				description={description}
				content={content}
			>
				{children}
			</CustomDialog>
		</View>
	);
}

function InnerProviders({ children }: { children: React.ReactNode }) {
	const [queryClient] = useState(() => new QueryClient());
	const [theme] = useRootTheme();

	const verifyAuth = useAuthStore((state) => state.verifyAuth);
	const isLoading = useAuthStore((state) => state.isLoading);

	useEffect(() => {
		verifyAuth();
	}, [verifyAuth]);

	if (isLoading) {
		return (
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
					backgroundColor: "black",
					height: "100vh",
				}}
			>
				<OrbitProgress color="white" />
			</div>
		);
	}

	return (
		<QueryClientProvider client={queryClient}>
			<TamaguiProvider config={config} defaultTheme={theme}>
				<MainView>
					<ContextMenu />
					<Navbar />
					{children}
				</MainView>
			</TamaguiProvider>
		</QueryClientProvider>
	);
}

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<NextThemeProvider skipNextHead>
			<InnerProviders>{children}</InnerProviders>
		</NextThemeProvider>
	);
}
