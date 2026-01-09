"use client";

import { AuthCard } from "@repo/features";
import { type JSX } from "react";
import { YStack } from "tamagui";

export default function SignIn(): JSX.Element {
	return (
		<YStack justify="center" height="calc(100vh - var(--navbar-height))">
			<AuthCard
				style={{ margin: "0px auto 50px auto" }}
				onSignIn={() => {
					window.location.href = "/protected";
				}}
			/>
		</YStack>
	);
}
