import { CalendarDays } from "@tamagui/lucide-icons";
import { Tabs } from "expo-router";

export default function TabLayout() {
	return (
		<Tabs>
			<Tabs.Screen
				name="calendar"
				options={{
					title: "Calendar",
					tabBarIcon: () => <CalendarDays />,
				}}
			/>
		</Tabs>
	);
}
