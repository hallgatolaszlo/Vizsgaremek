import { useCalendarStore, useProfileStore } from "@repo/hooks";
import { CalendarCellProps } from "@repo/types";
import { StyledButton } from "@repo/ui";
import {
	ArrowBigLeft,
	ArrowBigRight,
	CalendarDays,
} from "@tamagui/lucide-icons";
import { useEffect, useRef, useState } from "react";
import { Separator, Text, XGroup, XStack } from "tamagui";

interface CalendarHeaderProps {
	grid: Record<string, CalendarCellProps[]>;
	decreaseView: () => void;
	increaseView: () => void;
}

export default function CalendarHeader({
	grid,
	decreaseView,
	increaseView,
}: CalendarHeaderProps) {
	const { selectedDate, viewType, setViewType, resetToToday } =
		useCalendarStore();
	const profileStore = useProfileStore();
	const [isWrapped, setIsWrapped] = useState(false);
	const headerRef = useRef<HTMLDivElement>(null);

	// Detect if header items wrap to two lines
	useEffect(() => {
		const checkWrap = () => {
			if (headerRef.current) {
				const children = headerRef.current.children;
				if (children.length >= 2) {
					const firstChild = children[0].getBoundingClientRect();
					const secondChild = children[1].getBoundingClientRect();
					setIsWrapped(firstChild.top !== secondChild.top);
				}
			}
		};

		checkWrap();

		// Use ResizeObserver to detect changes in the container size
		const resizeObserver = new ResizeObserver(checkWrap);
		if (headerRef.current) {
			resizeObserver.observe(headerRef.current);
		}

		window.addEventListener("resize", checkWrap);
		return () => {
			window.removeEventListener("resize", checkWrap);
			resizeObserver.disconnect();
		};
	}, [grid, viewType]);

	const headerDateText = () => {
		const date = selectedDate;
		if (viewType === "month") {
			return date.toLocaleDateString(profileStore.locale, {
				year: "numeric",
				month: "long",
			});
		}
		if (viewType === "multiweek") {
			const startDate = grid[Object.keys(grid)[0]][0].date;
			const endDate = grid[Object.keys(grid)[3]][6].date;
			const startString = startDate.toLocaleDateString(
				profileStore.locale,
				{
					year: "numeric",
					month: "long",
					day: "numeric",
				},
			);
			const endString = endDate.toLocaleDateString(profileStore.locale, {
				year: "numeric",
				month: "long",
				day: "numeric",
			});
			return `${startString} - ${endString}`;
		}
		if (viewType === "week") {
			const startDate = grid[Object.keys(grid)[0]][0].date;
			const endDate = grid[Object.keys(grid)[0]][6].date;
			const startString = startDate.toLocaleDateString(
				profileStore.locale,
				{ year: "numeric", month: "long", day: "numeric" },
			);
			const endString = endDate.toLocaleDateString(profileStore.locale, {
				year: "numeric",
				month: "long",
				day: "numeric",
			});
			return `${startString} - ${endString}`;
		}
		if (viewType === "day") {
			return date.toLocaleDateString(profileStore.locale, {
				year: "numeric",
				month: "long",
				day: "numeric",
				weekday: "long",
			});
		}
	};

	const headerWeekText = () => {
		if (viewType === "month" || viewType === "multiweek") {
			const firstWeek = Object.keys(grid)[0]
				.replace("W0", "")
				.replace("W", "");
			const lastWeek = Object.keys(grid)
				[Object.keys(grid).length - 1].replace("W0", "")
				.replace("W", "");
			return `Weeks ${firstWeek} - ${lastWeek}`;
		} else if (viewType === "week" || viewType === "day") {
			const weekNumber = Object.keys(grid)[0]
				.replace("W0", "")
				.replace("W", "");
			return `Week ${weekNumber}`;
		}
	};

	const HeaderDateButtonGroup = () => {
		return (
			<XGroup>
				<XGroup.Item>
					<StyledButton onPress={decreaseView}>
						<Text>
							<ArrowBigLeft />
						</Text>
					</StyledButton>
				</XGroup.Item>
				<Separator vertical />
				<XGroup.Item>
					<StyledButton onPress={resetToToday}>
						<Text>
							<CalendarDays />
						</Text>
					</StyledButton>
				</XGroup.Item>
				<Separator vertical />
				<XGroup.Item>
					<StyledButton onPress={increaseView}>
						<Text>
							<ArrowBigRight />
						</Text>
					</StyledButton>
				</XGroup.Item>
			</XGroup>
		);
	};

	const ViewTypeToggle = () => {
		return (
			<XGroup>
				<StyledButton
					bg={viewType === "day" ? "$color5" : "$color4"}
					onPress={() => setViewType("day")}
				>
					<Text style={{ userSelect: "none" }}>Day</Text>
				</StyledButton>

				<Separator vertical />

				<StyledButton
					bg={viewType === "week" ? "$color5" : "$color4"}
					onPress={() => setViewType("week")}
				>
					<Text style={{ userSelect: "none" }}>Week</Text>
				</StyledButton>

				<Separator vertical />

				<StyledButton
					bg={viewType === "multiweek" ? "$color5" : "$color4"}
					onPress={() => setViewType("multiweek")}
				>
					<Text style={{ userSelect: "none" }}>Multiweek</Text>
				</StyledButton>

				<Separator vertical />

				<StyledButton
					bg={viewType === "month" ? "$color5" : "$color4"}
					onPress={() => setViewType("month")}
				>
					<Text style={{ userSelect: "none" }}>Month</Text>
				</StyledButton>
			</XGroup>
		);
	};

	return (
		<XStack
			ref={headerRef}
			flex={1}
			flexBasis={0}
			bg={"$color2"}
			p="$4"
			gap="$2"
			style={{
				maxHeight: "fit-content",
				flexWrap: "wrap",
				justifyContent: "space-between",
				gap: 20,
			}}
		>
			<XStack
				flex={1}
				style={{
					justifyContent: "start",
					alignItems: "center",
					gap: 20,
				}}
			>
				<HeaderDateButtonGroup />
				<Text fontWeight="$2">{headerDateText()}</Text>
			</XStack>
			<XStack
				flex={1}
				style={{
					justifyContent: isWrapped ? "start" : "end",
					alignItems: "center",
					gap: 20,
				}}
			>
				{isWrapped && <ViewTypeToggle />}
				<Text fontWeight="$2">{headerWeekText()}</Text>
				{!isWrapped && <ViewTypeToggle />}
			</XStack>
		</XStack>
	);
}
