import {
	useCalendarStore,
	useContextMenuStore,
	useProfileStore,
} from "@repo/hooks";
import { CalendarCellProps } from "@repo/types";
import { isNative } from "@repo/utils";
import { useEffect, useRef } from "react";
import { Card, CardProps, Text } from "tamagui";

interface CalendarCellComponentProps extends CardProps {
	cell: CalendarCellProps;
}

export default function CalendarCell(props: CalendarCellComponentProps) {
	const { selectedDate, viewType, setSelectedDate, currentDate } =
		useCalendarStore();
	const { locale } = useProfileStore();
	const { setFieldType: setType, setDate } = useContextMenuStore();

	const { cell } = props;

	const cardRef = useRef<any>(null);

	useEffect(() => {
		const element = cardRef.current;
		if (!element) return;

		const handleContextMenu = (e: MouseEvent) => {
			e.preventDefault();
			e.stopPropagation();

			setType("cell");
			setDate(new Date(cell.date));
		};

		element.addEventListener("contextmenu", handleContextMenu);
		return () => {
			element.removeEventListener("contextmenu", handleContextMenu);
		};
	}, [cardRef.current]);

	// Determine header label to show
	const headerLabel = () => {
		// Native: just show the date number
		if (isNative()) {
			return cell.date.getDate();
		}

		if (viewType === "day") {
			// Day view: show full weekday name, month name, date number
			return cell.date.toLocaleDateString(locale, {
				weekday: "long",
				month: "long",
				day: "numeric",
			});
		}

		if (viewType === "week") {
			// Multiweek view: show abbreviated weekday name and date number
			return cell.date.toLocaleDateString(locale, {
				month: "short",
				day: "numeric",
			});
		}

		// Web: show month abbreviation if first of month...
		if (cell.date.getDate() === 1) {
			return cell.date.toLocaleDateString(locale, {
				month: "short",
				day: "numeric",
			});
		}

		// ... or last of month
		let date: Date = new Date(cell.date);
		date.setDate(date.getDate() + 1);
		if (date.getMonth() !== cell.date.getMonth()) {
			return cell.date.toLocaleDateString(locale, {
				month: "short",
				day: "numeric",
			});
		}

		// Otherwise, just show the date number
		return cell.date.toLocaleDateString(locale, { day: "numeric" });
	};

	function decideStyling(cell: CalendarCellProps): CardProps {
		// Selected date styling
		if (cell.date.toDateString() === selectedDate.toDateString()) {
			return {
				bg: "$accent3",
				outlineWidth: 2,
				outlineOffset: -2,
				outlineColor: "$accent9",
				outlineStyle: "solid",
				position: "relative",
				zIndex: 500,
			} as CardProps;
		}
		// Current date styling
		if (cell.date.toDateString() === currentDate.toDateString()) {
			return { bg: "$accent1" } as CardProps;
		}
		// Out-of-month styling for month view
		if (viewType === "month" && !cell.inCurrentMonth) {
			return { bg: "$color2" } as CardProps;
		}
		// Default styling
		return { bg: "$color1" } as CardProps;
	}

	return (
		<Card
			{...decideStyling(cell)}
			style={props.style}
			flex={1}
			flexBasis={0}
			minW={0}
			onPress={() => setSelectedDate(new Date(cell.date))}
			ref={cardRef}
		>
			<Card.Header
				p={"$2"}
				style={{
					margin: 0,
					alignItems: "center",
				}}
			>
				<Text
					fontWeight="$2"
					style={{
						textAlign: "center",
						textWrap: "none",
						wordBreak: "unset",
						wordWrap: "unset",
						overflowWrap: "unset",
						height: "fit-content",
					}}
				>
					{headerLabel()}
				</Text>
			</Card.Header>
		</Card>
	);
}
