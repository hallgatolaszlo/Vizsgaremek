"use client";

import SidebarCalendar from "@/src/components/ui/CalendarPage/SidebarCalendar";
import { Calendar } from "@repo/features";
import { useCalendarStore } from "@repo/hooks";
import { FullscreenView } from "@repo/ui";
import { XStack, YStack } from "tamagui";

export default function CalendarPage() {
	const calendarStore = useCalendarStore();

	return (
		<FullscreenView stack="XStack">
			<YStack p="$4" bg="$color2" minH="100%" style={{ width: 400 }}>
				<SidebarCalendar
					calendarState={calendarStore}
				></SidebarCalendar>
				{/* My calendars */}
			</YStack>
			<XStack p="$2" minW={0} flex={1}>
				<Calendar calendarState={calendarStore} />
			</XStack>
		</FullscreenView>
	);
}
