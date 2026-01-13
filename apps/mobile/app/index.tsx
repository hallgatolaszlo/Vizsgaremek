import { useAuthStore } from "@repo/hooks";
import { Redirect } from "expo-router";

export default function Index() {
	const isAuthorized = useAuthStore((state) => state.isAuthorized);

	if (isAuthorized) {
		return <Redirect href="/(protected)/protected" />;
	}

	return <Redirect href="/(guest)/sign-in" />;
}
