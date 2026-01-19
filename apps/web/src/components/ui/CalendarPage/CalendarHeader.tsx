import { useCalendarStore, useProfileStore } from "@repo/hooks";
import { CalendarCellProps } from "@repo/types";
import { StyledButton, ToggleGroupItemText } from "@repo/ui";
import {
	ArrowBigLeft,
	ArrowBigRight,
	CalendarDays,
} from "@tamagui/lucide-icons";
import { useEffect, useRef, useState } from "react";
import { Separator, Text, ToggleGroup, View, XGroup, XStack } from "tamagui";

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
			<View>
				<ToggleGroup type="single" defaultValue="month">
					<ToggleGroup.Item
						value="day"
						onPress={() => setViewType("day")}
					>
						<ToggleGroupItemText text="Day" />
					</ToggleGroup.Item>
					<ToggleGroup.Item
						value="week"
						onPress={() => setViewType("week")}
					>
						<ToggleGroupItemText text="Week" />
					</ToggleGroup.Item>
					<ToggleGroup.Item
						value="multiweek"
						onPress={() => setViewType("multiweek")}
					>
						<ToggleGroupItemText text="Multiweek" />
					</ToggleGroup.Item>
					<ToggleGroup.Item
						value="month"
						onPress={() => setViewType("month")}
					>
						<ToggleGroupItemText text="Month" />
					</ToggleGroup.Item>
				</ToggleGroup>
			</View>
		);
	};

	return (
		<XStack
			ref={headerRef}
			flex={1}
			flexBasis={0}
			py="$2"
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
					gap: 10,
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
					gap: 10,
				}}
			>
				{isWrapped && <ViewTypeToggle />}
				<Text fontWeight="$2">{headerWeekText()}</Text>
				{!isWrapped && <ViewTypeToggle />}
			</XStack>
		</XStack>
	);
}
