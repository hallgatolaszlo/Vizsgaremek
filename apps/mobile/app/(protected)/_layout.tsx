import { Tabs } from "expo-router";

export default function TabLayout() {
	return (
		<Tabs>
			<Tabs.Screen
				name="protected"
				options={{
					title: "Home",
				}}
			/>
		</Tabs>
	);
}
