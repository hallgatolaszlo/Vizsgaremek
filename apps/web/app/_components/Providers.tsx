"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useAuthStore } from "../_hooks/useAuthStore";
import PrivateNavbar from "./navbars/PrivateNavbar";
import PublicNavbar from "./navbars/PublicNavbar";

export function Providers({ children }: { children: React.ReactNode }) {
	// Create QueryClient once, not on every render
	const [queryClient] = useState(() => new QueryClient());

	const verifyAuth = useAuthStore((state) => state.verifyAuth);
	const isAuthorized = useAuthStore((state) => state.isAuthorized);
	const isLoading = useAuthStore((state) => state.isLoading);

	useEffect(() => {
		verifyAuth();
	}, [verifyAuth]);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<QueryClientProvider client={queryClient}>
			{isAuthorized ? <PrivateNavbar /> : <PublicNavbar />}
			{children}
		</QueryClientProvider>
	);
}
