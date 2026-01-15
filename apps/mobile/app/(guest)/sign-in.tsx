import { AuthCard } from "@repo/features";
import { router } from "expo-router";
import { View } from "tamagui";

export default function SignIn() {
	return (
		<View height="100%" bg="$color1" justify="center">
			<AuthCard
				style={{ margin: "auto" }}
				onSignIn={() => {
					router.push("/(protected)/calendar");
				}}
			/>
		</View>
	);
}
