"use client";

import { FullscreenView } from "@/src/components/ui/FullscreenView";
import { AuthCard } from "@repo/features";
import { type JSX } from "react";

export default function SignIn(): JSX.Element {
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
