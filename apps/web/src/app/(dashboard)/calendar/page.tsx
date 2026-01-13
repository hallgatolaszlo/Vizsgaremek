"use client";

import SidebarCalendar from "@/src/components/ui/CalendarPage/SidebarCalendar";
import { H1, H3, View, XStack, YStack } from "tamagui";

export default function CalendarPage() {
	return (
		<XStack minH="calc(100vh - var(--navbar-height))">
			<YStack p="$4" bg="$color2" minH="100%" style={{ width: 400 }}>
				<SidebarCalendar></SidebarCalendar>
				<H3>My calendars</H3>
			</YStack>
			<View>
				<H1>Calendar</H1>
			</View>
		</XStack>
	);
}
