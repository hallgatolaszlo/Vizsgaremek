import { H1, Text, View } from "tamagui";

export default function ForbiddenPage() {
	return (
		<View style={{ textAlign: "center", marginTop: "2rem" }}>
			<H1>403 - Forbidden</H1>
			<Text>You do not have permission to access this page.</Text>
		</View>
	);
}
