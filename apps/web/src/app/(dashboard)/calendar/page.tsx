"use client";

import SidebarCalendar from "@/src/components/ui/CalendarPage/SidebarCalendar";
import { FullscreenView } from "@/src/components/ui/FullscreenView";
import { Calendar } from "@repo/features";
import { useCalendarStore } from "@repo/hooks";
import { CalendarViewType } from "@repo/types";
import { StyledButton, ToggleGroupItemText } from "@repo/ui";
import {
	ArrowBigLeft,
	ArrowBigRight,
	CalendarDays,
} from "@tamagui/lucide-icons";
import type { ComponentProps, ReactElement, WheelEventHandler } from "react";
import { useState } from "react";
import { Text, ToggleGroup, XGroup, XStack, YStack } from "tamagui";

type WheelableYStackProps = ComponentProps<typeof YStack> & {
	onWheel?: WheelEventHandler;
};

const WheelableYStack = YStack as unknown as (
	props: WheelableYStackProps
) => ReactElement;

export default function CalendarPage() {
	const calendarStore = useCalendarStore();
	const [viewType, setViewType] = useState<CalendarViewType>("month");

	function decreaseView() {
		if (viewType === "month") {
			calendarStore.decMonth();
			return;
		}
		calendarStore.decWeek();
	}

	function increaseView() {
		if (viewType === "month") {
			calendarStore.incMonth();
			return;
		}
		calendarStore.incWeek();
	}

	const handleCalendarWheel: WheelEventHandler = (e) => {
		// Only triggers while the cursor is over this Calendar wrapper.
		e.preventDefault();
		e.stopPropagation();

		if (e.deltaY > 0) {
			increaseView();
			return;
		}
		if (e.deltaY < 0) {
			decreaseView();
		}
	};

	return (
		<FullscreenView stack="XStack">
			<YStack p="$4" bg="$color2" minH="100%" style={{ width: 400 }}>
				<SidebarCalendar
					calendarState={calendarStore}
				></SidebarCalendar>
				{/* My calendars */}
			</YStack>
			<YStack p="$2" gap="$2" minW={0} flex={1}>
				<XStack>
					<XGroup>
						<XGroup.Item>
							<StyledButton onPress={decreaseView}>
								<Text>
									<ArrowBigLeft />
								</Text>
							</StyledButton>
						</XGroup.Item>
						<XGroup.Item>
							<StyledButton onPress={calendarStore.resetToToday}>
								<Text>
									<CalendarDays />
								</Text>
							</StyledButton>
						</XGroup.Item>
						<XGroup.Item>
							<StyledButton onPress={increaseView}>
								<Text>
									<ArrowBigRight />
								</Text>
							</StyledButton>
						</XGroup.Item>
					</XGroup>

					<ToggleGroup type="single" defaultValue="month">
						<ToggleGroup.Item
							value="month"
							onPress={() => setViewType("month")}
						>
							<ToggleGroupItemText text="Month" />
						</ToggleGroup.Item>
						<ToggleGroup.Item
							value="multiweek"
							onPress={() => setViewType("multiweek")}
						>
							<ToggleGroupItemText text="Multiweek" />
						</ToggleGroup.Item>
					</ToggleGroup>
				</XStack>
				<WheelableYStack
					onWheel={handleCalendarWheel}
					flex={1}
					minW={0}
				>
					<Calendar
						calendarState={calendarStore}
						viewType={viewType}
					/>
				</WheelableYStack>
			</YStack>
		</FullscreenView>
	);
}
