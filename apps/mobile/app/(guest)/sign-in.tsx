import { AuthCard } from "@repo/features";
import { router } from "expo-router";

export default function SignIn() {
	return (
		<AuthCard
			onSignIn={() => {
				router.push("/(protected)/protected");
			}}
		/>
	);
}
