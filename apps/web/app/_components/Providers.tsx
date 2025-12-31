"use client";

import tamaguiConfig from "@/tamagui.config";
import useAuthStore from "@repo/hooks/useAuthStore";
import { NextThemeProvider, useRootTheme } from "@tamagui/next-theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useServerInsertedHTML } from "next/navigation";
import { useEffect, useState } from "react";
import { TamaguiProvider } from "tamagui";
import PrivateNavbar from "./navbars/PrivateNavbar";
import PublicNavbar from "./navbars/PublicNavbar";

export function Providers({ children }: { children: React.ReactNode }) {
	// Create QueryClient once, not on every render
	const [queryClient] = useState(() => new QueryClient());
	const [theme, setTheme] = useRootTheme();

	const verifyAuth = useAuthStore((state) => state.verifyAuth);
	const isAuthorized = useAuthStore((state) => state.isAuthorized);
	const isLoading = useAuthStore((state) => state.isLoading);

	useServerInsertedHTML(() => {
		return (
			<style jsx global>{`
				html {
					font-family: "Inter";
				}
			`}</style>
		);
	});

	useEffect(() => {
		verifyAuth();
	}, [verifyAuth]);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<NextThemeProvider
			skipNextHead
			defaultTheme="light"
			onChangeTheme={(next) => {
				setTheme(next as any);
			}}
		>
			<TamaguiProvider config={tamaguiConfig} defaultTheme={theme}>
				<QueryClientProvider client={queryClient}>
					{isAuthorized ? <PrivateNavbar /> : <PublicNavbar />}
					{children}
				</QueryClientProvider>
			</TamaguiProvider>
		</NextThemeProvider>
	);
}
