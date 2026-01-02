"use client";

import { useAuthStore } from "@repo/hooks";
import { H1, View } from "tamagui";
import UnauthorizedPage from "../../../pages/401";

export default function ProtectedPage() {
	const isAuthorized = useAuthStore((state) => state.isAuthorized);

	if (!isAuthorized) {
		return <UnauthorizedPage></UnauthorizedPage>;
	}

	return (
		<View>
			<H1>Protected Page - Authorized Users Only</H1>
		</View>
	);
}
