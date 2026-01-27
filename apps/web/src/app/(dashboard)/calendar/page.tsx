"use client";

import CalendarHeader from "@/src/components/CalendarPage/CalendarHeader";
import Sidebar from "@/src/components/CalendarPage/Sidebar";
import { FullscreenView } from "@/src/components/FullscreenView";
import { Calendar } from "@repo/features";
import { useCalendarStore, useProfileStore } from "@repo/hooks";
import { generateGrid } from "@repo/utils";
import { useEffect, useMemo, useRef } from "react";
import { XStack } from "tamagui";

export default function CalendarPage() {
	const {
		selectedDate,
		viewType,
		setViewType,
		decMonth,
		incMonth,
		decWeek,
		incWeek,
		decDay,
		incDay,
	} = useCalendarStore();

	const { weekStartsOn } = useProfileStore();

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

	// Attach a non-passive wheel listener to allow preventDefault
	const wheelableYStackRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const el = wheelableYStackRef.current;
		if (!el || viewType === "day" || viewType === "week") return;

		const handleWheel = (e: WheelEvent) => {
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

		el.addEventListener("wheel", handleWheel, { passive: false });
		return () => el.removeEventListener("wheel", handleWheel);
	}, [increaseView, decreaseView, viewType]);

	return (
		<FullscreenView
			flex={1}
			stack="XStack"
			maxHeight
			overflow="hidden"
			bg={"$color2"}
		>
			<Sidebar />
			{/* My calendars */}
			<FullscreenView maxHeight minW={0} flex={1}>
				{/* Calendar Header */}
				<CalendarHeader
					grid={grid}
					decreaseView={decreaseView}
					increaseView={increaseView}
				/>
				<XStack ref={wheelableYStackRef} flex={1} minW={0}>
					<Calendar grid={grid} />
				</XStack>
			</FullscreenView>
		</FullscreenView>
	);
}
