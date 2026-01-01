"use client";

import { config } from "@repo/config";
import { useAuthStore } from "@repo/hooks";
import { NextThemeProvider, useRootTheme } from "@tamagui/next-theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useServerInsertedHTML } from "next/navigation";
import { useEffect, useState } from "react";
import { TamaguiProvider } from "tamagui";
import PrivateNavbar from "./navbars/PrivateNavbar";
import PublicNavbar from "./navbars/PublicNavbar";

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
		return null;
	}

	return (
		<QueryClientProvider client={queryClient}>
			<TamaguiProvider config={config} defaultTheme={theme}>
				{isAuthorized ? <PrivateNavbar /> : <PublicNavbar />}
				{children}
			</TamaguiProvider>
		</QueryClientProvider>
	);
}

export function Providers({ children }: { children: React.ReactNode }) {
	useServerInsertedHTML(() => {
		return (
			<style jsx global>{`
				html {
					font-family: "Inter";
				}
			`}</style>
		);
	});

	return (
		<NextThemeProvider skipNextHead>
			<InnerProviders>{children}</InnerProviders>
		</NextThemeProvider>
	);
}
