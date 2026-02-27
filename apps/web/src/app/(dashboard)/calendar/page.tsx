"use client";

import CalendarHeader from "@/src/components/CalendarPage/CalendarHeader";
import Sidebar from "@/src/components/CalendarPage/Sidebar";
import { FullscreenView } from "@/src/components/FullscreenView";
import { Calendar } from "@repo/features";
import {
	useCalendarStore,
	useNotificationStore,
	useProfileStore,
} from "@repo/hooks";
import { generateGrid } from "@repo/utils";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { XStack } from "tamagui";

export default function CalendarPage() {
	const {
		selectedDate,
		viewType,
		decMonth,
		incMonth,
		decWeek,
		incWeek,
		decDay,
		incDay,
	} = useCalendarStore();

	const { weekStartsOn } = useProfileStore();

	const { isConnected, connection } = useNotificationStore();
	useEffect(() => {
		console.log("isConnected state:", isConnected);
		console.log("Actual connection state:", connection?.state);
	}, [isConnected, connection]);

	const grid = useMemo(
		() =>
			generateGrid({
				selectedDate: selectedDate,
				weekStartsOn: weekStartsOn,
				viewType: viewType,
			}),
		[selectedDate, weekStartsOn, viewType],
	);

	const decreaseView = useCallback(() => {
		if (viewType === "month") {
			decMonth();
			return;
		}
		if (viewType === "day") {
			decDay();
			return;
		}
		decWeek();
	}, [viewType, decMonth, decDay, decWeek]);

	const increaseView = useCallback(() => {
		if (viewType === "month") {
			incMonth();
			return;
		}
		if (viewType === "day") {
			incDay();
			return;
		}
		incWeek();
	}, [viewType, incMonth, incDay, incWeek]);

	// Attach a non-passive wheel listener to allow preventDefault
	const wheelableYStackRef = useRef<HTMLDivElement | null>(null);

	const handleWheel = useMemo(() => {
		return (e: WheelEvent) => {
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
	}, [increaseView, decreaseView]);

	useEffect(() => {
		const el = wheelableYStackRef.current;
		if (!el || viewType === "day" || viewType === "week") return;
		el.addEventListener("wheel", handleWheel, { passive: false });
		return () => el.removeEventListener("wheel", handleWheel);
	}, [viewType, handleWheel]);

	return (
		<FullscreenView
			flex={1}
			stack="XStack"
			maxHeightDefined
			overflow="hidden"
			bg={"$color2"}
		>
			<Sidebar />
			{/* My calendars */}
			<FullscreenView maxHeightDefined minW={0} flex={1}>
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
