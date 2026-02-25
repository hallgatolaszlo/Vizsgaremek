import { useCalendarStore, useProfileStore } from "@repo/hooks";
import { CalendarCellProps, CalendarViewType } from "@repo/types";
import { SelectElement, StyledButton } from "@repo/ui";
import {
	ArrowBigLeft,
	ArrowBigRight,
	CalendarDays,
} from "@tamagui/lucide-icons";
import { Select, Separator, Text, View, XGroup, XStack, YStack } from "tamagui";

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
				<SelectElement
					value={viewType}
					onValueChange={(value) =>
						setViewType(value as CalendarViewType)
					}
					renderValue={(value) => (
						<Select.ItemText>
							{value.charAt(0).toUpperCase() + value.slice(1)}
						</Select.ItemText>
					)}
					triggerPlaceholder=""
					groupItems={["month", "multiweek", "week", "day"].map(
						(view, index) => (
							<Select.Item
								style={{
									backgroundColor:
										(view as CalendarViewType) == viewType
											? "var(--accent4)"
											: "var(--color2)",
								}}
								value={view as CalendarViewType}
								index={index}
								key={view}
							>
								<Select.ItemText
									style={{ textTransform: "capitalize" }}
								>
									{view}
								</Select.ItemText>
							</Select.Item>
						),
					)}
				/>
			</View>
		);
	};

	return (
		<YStack
			bg={"$color2"}
			p="$4"
			gap="$2"
			style={{
				maxHeight: "fit-content",
				gap: 20,
			}}
		>
			<XStack
				style={{
					justifyContent: "space-between",
					alignItems: "center",
					gap: 20,
				}}
			>
				<HeaderDateButtonGroup />
				<ViewTypeToggle />
			</XStack>
			<XStack
				style={{
					alignItems: "center",
					gap: 20,
				}}
			>
				<Text fontWeight="$2" textTransform="capitalize">
					{headerDateText()}
				</Text>
			</XStack>
		</YStack>
	);
}
