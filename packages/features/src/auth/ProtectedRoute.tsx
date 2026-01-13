import { useAuthStore } from "@repo/hooks";
import { JSX } from "react";
import { H1, View } from "tamagui";

export function ProtectedRoute({
	children,
}: {
	children: React.ReactNode;
}): JSX.Element {
	const isAuthorized = useAuthStore((state) => state.isAuthorized);

	if (!isAuthorized) {
		return (
			<View>
				<H1>Access Denied. Please log in to continue.</H1>
			</View>
		);
	}

	// TODO: Forbidden
	/*
    if (forbidden) {
        return (
			<View>
				<H1>Access Denied. You do not have permission to view this page.</H1>
			</View>
		);
    }
        */

	return <>{children}</>;
}
