import { zodResolver } from "@hookform/resolvers/zod";
import { createCalendar } from "@repo/api";
import { components } from "@repo/types";
import { SelectElement, StyledButton, StyledInput } from "@repo/ui";
import { Check } from "@tamagui/lucide-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
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
type CreateCalendarDTO = components["schemas"]["CreateCalendarDTO"];

// Zod schema for sign-up form validation
const createCalendarEntrySchema = z.object({
	name: z
		.string()
		.min(1, "The name field is required")
		.min(3, "The name should be at least 3 characters long")
		.max(20, "The name should be at most 20 characters long"),
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

function ColorSelectItem({
	color,
	index,
	isSelected,
}: {
	color: any;
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

export function CreateCalendarForm({ onSuccess }: { onSuccess?: () => void }) {
	const [error, setError] = useState<string | null>(null);
	const theme = useTheme({ name: "calendarColors" });
	const queryClient = useQueryClient();
	const colors = useRef<Record<string, any>>({
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
		resolver: zodResolver(createCalendarEntrySchema),
		defaultValues: {
			name: "",
			color: 1,
		},
	});
	0;

	// Mutation for sign-up action
	const createCalendarMutation = useMutation({
		mutationFn: async (request: CreateCalendarDTO) => {
			await createCalendar(request);
		},
		onSuccess: () => {
			reset();
			queryClient.invalidateQueries({ queryKey: ["myCalendars"] });
			onSuccess?.(); // Call the callback to close the popover
		},
		onError: (err) => {
			if (err instanceof AxiosError && err.status === 400) {
				setError(err.response?.data);
			} else {
				setError(
					"An unexpected error occurred. Please try again later.",
				);
			}
		},
	});

	async function onSubmit(request: CreateCalendarDTO) {
		createCalendarMutation.mutate(request);
	}

	return (
		<Form>
			<XStack
				flex={1}
				gap={"$2"}
				style={{
					backgroundColor: "var(--color2)",
					padding: 10,
					border: "2px solid var(--color5)",
					borderRadius: 10,
				}}
			>
				<Controller
					control={control}
					name="color"
					render={({ field: { onChange, value } }) => (
						<View>
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
								triggerPlaceholder=""
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
						<YStack>
							<StyledInput
								autoFocus
								style={{ flexGrow: 1 }}
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
					onPress={handleSubmit(onSubmit)}
					disabled={createCalendarMutation.isPending}
					icon={
						createCalendarMutation.isPending
							? () => <Spinner color="$color12" />
							: undefined
					}
					scaleIcon={1.5}
					iconAfter={
						!createCalendarMutation.isPending ? (
							<Check />
						) : undefined
					}
				></StyledButton>
			</XStack>
		</Form>
	);
}
