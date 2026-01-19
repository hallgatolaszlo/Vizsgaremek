"use client";

import CalendarHeader from "@/src/components/ui/CalendarPage/CalendarHeader";
import SidebarCalendar from "@/src/components/ui/CalendarPage/SidebarCalendar";
import { FullscreenView } from "@/src/components/ui/FullscreenView";
import { Calendar } from "@repo/features";
import { useCalendarStore } from "@repo/hooks";
import { generateGrid } from "@repo/utils";
import type { ComponentProps, WheelEventHandler } from "react";
import { useMemo } from "react";
import { Separator, YStack } from "tamagui";

type WheelableProps = ComponentProps<typeof YStack> & {
	onWheel?: WheelEventHandler;
};

const WheelableYStack = (props: WheelableProps) => {
	return <YStack {...props}>{props.children}</YStack>;
};

export default function CalendarPage() {
	const {
		selectedDate,
		weekStartsOn,
		viewType,
		setViewType,
		decMonth,
		incMonth,
		decWeek,
		incWeek,
		decDay,
		incDay,
	} = useCalendarStore();

	const grid = useMemo(
		() =>
			generateGrid({
				selectedDate: selectedDate,
				weekStartsOn: weekStartsOn,
				viewType: viewType,
			}),
		[selectedDate, weekStartsOn, viewType],
	);

	function decreaseView() {
		if (viewType === "month") {
			decMonth();
			return;
		}
		if (viewType === "day") {
			decDay();
			return;
		}
		decWeek();
	}

	function increaseView() {
		if (viewType === "month") {
			incMonth();
			return;
		}
		if (viewType === "day") {
			incDay();
			return;
		}
		incWeek();
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
			<YStack
				flex={1}
				p="$4"
				bg="$color2"
				minH="100%"
				style={{ minWidth: 350, maxWidth: 400 }}
			>
				<SidebarCalendar />
				{/* My calendars */}
			</YStack>
			<YStack p="$2" gap="$2" minW={0} flex={1}>
				{/* Calendar Header */}
				<CalendarHeader
					grid={grid}
					decreaseView={decreaseView}
					increaseView={increaseView}
				/>
				<Separator mb="$2"></Separator>
				<WheelableYStack
					onWheel={handleCalendarWheel}
					flex={1}
					minW={0}
				>
					<Calendar grid={grid} />
				</WheelableYStack>
			</YStack>
		</FullscreenView>
	);
}
