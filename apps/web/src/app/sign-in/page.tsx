"use client";

import { AuthCard } from "@repo/features";
import { type JSX } from "react";

export default function SignIn(): JSX.Element {
	return (
		<AuthCard
			onSignIn={() => {
				window.location.href = "/protected";
			}}
		/>
	);
}
