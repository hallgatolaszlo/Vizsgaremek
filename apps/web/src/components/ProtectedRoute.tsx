import { useAuthStore } from "@repo/hooks";
import { H1 } from "tamagui";
import { FullscreenView } from "./FullscreenView";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
	const isAuthorized = useAuthStore((state) => state.isAuthorized);

	if (!isAuthorized) {
		return (
			<FullscreenView p={"$4"}>
				<H1>Access Denied. Please log in to continue.</H1>
			</FullscreenView>
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
