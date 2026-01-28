"use client";

import CalendarHeader from "@/src/components/CalendarPage/CalendarHeader";
import Sidebar from "@/src/components/CalendarPage/Sidebar";
import { FullscreenView } from "@/src/components/FullscreenView";
import { getCalendarEntry } from "@repo/api";
import { getCalendar } from "@repo/api/src/calendar";
import { Calendar } from "@repo/features";
import { useCalendarStore, useProfileStore } from "@repo/hooks";
import { components } from "@repo/types";
import { generateGrid } from "@repo/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef } from "react";
import { XStack } from "tamagui";

type getCalendarDTO = components["schemas"]["GetCalendarDTO"];

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

	const queryClient = useQueryClient();

	const myCalendarsQuery = useQuery<getCalendarDTO[]>({
		queryKey: ["myCalendars"],
		queryFn: async () => {
			const calendars = await getCalendar();
			queryClient.invalidateQueries({ queryKey: ["calendarEntries"] });
			return calendars;
		},
	});

	const calendarEntriesQuery = useQuery({
		queryKey: ["calendarEntries", myCalendarsQuery.data],
		queryFn: async () => {
			const calendarIds =
				myCalendarsQuery.data?.map((cal) => cal.id) || [];
			const entriesPromises = calendarIds.map(async (id) => {
				const response = await getCalendarEntry(id!);
				return response;
			});
			return await Promise.all(entriesPromises);
		},
		enabled: !!myCalendarsQuery.data,
	});

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
			<Sidebar myCalendarsQuery={myCalendarsQuery} />
			{/* My calendars */}
			<FullscreenView maxHeight minW={0} flex={1}>
				{/* Calendar Header */}
				<CalendarHeader
					grid={grid}
					decreaseView={decreaseView}
					increaseView={increaseView}
				/>
				<XStack ref={wheelableYStackRef} flex={1} minW={0}>
					<Calendar
						grid={grid}
						calendarEntriesQuery={calendarEntriesQuery}
					/>
				</XStack>
			</FullscreenView>
		</FullscreenView>
	);
}
