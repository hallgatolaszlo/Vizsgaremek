import { H1, Text, View } from "tamagui";

export default function UnauthorizedPage() {
	return (
		<View style={{ textAlign: "center", marginTop: "2rem" }}>
			<H1>401 - Unauthorized</H1>
			<Text>You need to log in to access this page.</Text>
		</View>
	);
}
