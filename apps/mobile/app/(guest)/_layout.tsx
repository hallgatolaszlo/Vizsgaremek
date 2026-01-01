import { House, LogIn } from "@tamagui/lucide-icons";
import { Tabs } from "expo-router";

export default function TabLayout() {
	return (
		<Tabs>
			<Tabs.Screen
				name="home"
				options={{
					title: "Home",
					tabBarIcon: () => <House />,
				}}
			/>
			<Tabs.Screen
				name="sign-in"
				options={{
					title: "Sign-In",
					tabBarIcon: () => <LogIn />,
				}}
			/>
		</Tabs>
	);
}
