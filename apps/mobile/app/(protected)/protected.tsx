import { ProtectedRoute } from "@repo/features";
import { Text, View } from "react-native";

export default function ProtectedPage() {
	return (
		<ProtectedRoute>
			<View>
				<Text>Protected Content</Text>
			</View>
		</ProtectedRoute>
	);
}
