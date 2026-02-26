import { zodResolver } from "@hookform/resolvers/zod";
import { updateCalendar } from "@repo/api";
import { components } from "@repo/types";
import { SelectElement, StyledButton, StyledInput } from "@repo/ui";
import { Check } from "@tamagui/lucide-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
	Form,
	Select,
	Spinner,
	Text,
	Theme,
	useTheme,
	View,
	XStack,
	YStack,
} from "tamagui";
import z from "zod";

// Type for sign-up request data from Swagger
type UpdateCalendarDTO = components["schemas"]["UpdateCalendarDTO"];

// Zod schema for sign-up form validation
const updateCalendarEntrySchema = z.object({
	name: z
		.string()
		.min(1, "The name field is required")
		.min(3, "The name should be at least 3 characters long")
		.max(32, "The name should be at most 32 characters long"),
	color: z.number().min(1).max(12),
});

// Component to display error messages
const ErrorText = ({ message }: { message: string | undefined }) => (
	<Theme name="error">
		<Text pl="$1" fontSize="$1" color="$color9">
			{message}
		</Text>
	</Theme>
);

type ThemeColor = ReturnType<typeof useTheme>["color1"];

function ColorSelectItem({
	color,
	index,
}: {
	color: ThemeColor;
	index: number;
	isSelected: boolean;
}) {
	const [isHovered, setIsHovered] = useState(false);

	return (
		<Select.Item
			unstyled
			index={index}
			value={(index + 1).toString()}
			flexBasis={0}
			style={
				isHovered
					? {
							outlineWidth: 2,
							outlineOffset: -2,
							outlineColor: "var(--accent9)",
							outlineStyle: "solid",
							borderRadius: 9,
						}
					: {}
			}
			onHoverIn={() => setIsHovered(true)}
			onHoverOut={() => setIsHovered(false)}
		>
			<Select.ItemText>
				<View
					style={{
						width: 20,
						height: 20,
						backgroundColor: color.val,
						borderRadius: "5.5px",
					}}
				/>
			</Select.ItemText>
		</Select.Item>
	);
}

export function UpdateCalendarForm({
	onSuccess,
	onBlur,
	calendar,
}: {
	onSuccess?: () => void;
	onBlur?: () => void;
	calendar: {
		name?: string | null | undefined;
		color?: number | undefined;
		id?: string | undefined;
	};
}) {
	const theme = useTheme({ name: "calendarColors" });
	const queryClient = useQueryClient();
	const colors = useRef<Record<string, ThemeColor>>({
		"1": theme.color1,
		"2": theme.color2,
		"3": theme.color3,
		"4": theme.color4,
		"5": theme.color5,
		"6": theme.color6,
		"7": theme.color7,
		"8": theme.color8,
		"9": theme.color9,
		"10": theme.color10,
		"11": theme.color11,
		"12": theme.color12,
	});

	const {
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(updateCalendarEntrySchema),
		defaultValues: {
			name: calendar.name!,
			color: calendar.color!,
		},
	});

	// Mutation for sign-up action
	const updateCalendarMutation = useMutation({
		mutationFn: async (request: UpdateCalendarDTO) => {
			await updateCalendar(request);
		},
		onSuccess: () => {
			reset();
			queryClient.invalidateQueries({ queryKey: ["myCalendars"] });
			queryClient.invalidateQueries({ queryKey: ["calendarEntries"] });
			onSuccess?.(); // Call the callback to close the popover
		},
	});

	async function onSubmit(request: UpdateCalendarDTO) {
		request.id = calendar.id!;
		updateCalendarMutation.mutate(request);
	}

	function handleBlur(event: React.FocusEvent<HTMLDivElement>) {
		// if the blur was because of outside focus
		// currentTarget is the parent element, relatedTarget is the clicked element
		const currentTarget = event.currentTarget;

		// Use setTimeout to allow focus to settle on the new element
		// This handles cases where relatedTarget is null (e.g., clicking on Select dropdown)
		requestAnimationFrame(() => {
			// Check if the new active element is within our form or in a portal (Select dropdown)
			const activeElement = document.activeElement;
			const isInForm = currentTarget.contains(activeElement);
			const isInPortal =
				document
					.querySelector("[data-radix-popper-content-wrapper]")
					?.contains(activeElement) ||
				document
					.querySelector('[role="listbox"]')
					?.contains(activeElement);

			if (!isInForm && !isInPortal) {
				onBlur?.();
			}
		});
	}

	return (
		<Form style={{ width: "100%" }}>
			<XStack
				gap={"$2"}
				p={"$2"}
				px={15}
				onBlur={handleBlur}
				width="100%"
			>
				<Controller
					control={control}
					name="color"
					render={({ field: { onChange, value } }) => (
						<View style={{ flexShrink: 0 }}>
							<SelectElement
								value={value.toString()}
								onValueChange={(value) =>
									onChange(Number(value))
								}
								renderValue={(value) => (
									<View
										bg={"red"}
										style={{
											width: 20,
											height: 20,
											backgroundColor:
												colors.current[value].val,
											borderRadius: "5.5px",
										}}
									></View>
								)}
								groupItems={Object.values(colors.current).map(
									(color, i) => (
										<ColorSelectItem
											key={i}
											color={color}
											index={i}
											isSelected={value === i + 1}
										/>
									),
								)}
								groupStyle={{
									display: "grid",
									gridTemplateColumns: "1fr 1fr 1fr 1fr",
								}}
							/>
						</View>
					)}
				/>
				<Controller
					control={control}
					name="name"
					render={({ field: { onChange, onBlur, value, ref } }) => (
						<YStack flex={1} minW={0}>
							<StyledInput
								autoFocus
								ref={ref}
								placeholder="Name"
								onBlur={onBlur}
								onChange={onChange}
								value={value}
								returnKeyType="done"
								onSubmitEditing={handleSubmit(onSubmit)}
							/>
							{errors.name && (
								<ErrorText message={errors.name.message} />
							)}
						</YStack>
					)}
				/>
				<StyledButton
					style={{ flexShrink: 0 }}
					onPress={handleSubmit(onSubmit)}
					disabled={updateCalendarMutation.isPending}
					icon={
						updateCalendarMutation.isPending
							? () => <Spinner color="$color12" />
							: undefined
					}
					scaleIcon={1.5}
					iconAfter={
						!updateCalendarMutation.isPending ? (
							<Check />
						) : undefined
					}
				></StyledButton>
			</XStack>
		</Form>
	);
}
