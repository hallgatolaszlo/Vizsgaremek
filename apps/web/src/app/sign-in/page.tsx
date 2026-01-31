"use client";

import { FullscreenView } from "@/src/components/FullscreenView";
import { AuthCard } from "@repo/features";
import { useAuthStore } from "@repo/hooks";

export default function SignIn() {
	const { isAuthorized } = useAuthStore();

	if (isAuthorized) {
		window.location.href = "/calendar";
	}

	return (
		<FullscreenView justify="center">
			<AuthCard
				style={{ margin: "0px auto 50px auto" }}
				onSignIn={() => {
					window.location.href = "/calendar";
				}}
			/>
		</FullscreenView>
	);
}
