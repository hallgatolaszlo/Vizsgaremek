import { H1, Text, View } from "tamagui";

export default function NotFoundPage() {
	return (
		<View style={{ textAlign: "center", marginTop: "2rem" }}>
			<H1>404 - Page Not Found</H1>
			<Text>The page you are looking for does not exist.</Text>
		</View>
	);
}
