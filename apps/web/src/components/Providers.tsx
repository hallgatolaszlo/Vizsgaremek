"use client";

import { config } from "@repo/config";
import { useAuthStore } from "@repo/hooks";
import { NextThemeProvider, useRootTheme } from "@tamagui/next-theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { OrbitProgress } from "react-loading-indicators";
import { TamaguiProvider, View } from "tamagui";
import Navbar from "./ui/Navbar";

function InnerProviders({ children }: { children: React.ReactNode }) {
	const [queryClient] = useState(() => new QueryClient());
	const [theme] = useRootTheme();

	const verifyAuth = useAuthStore((state) => state.verifyAuth);
	const isAuthorized = useAuthStore((state) => state.isAuthorized);
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
				<View background="$color1">
					<Navbar />
					{children}
				</View>
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
