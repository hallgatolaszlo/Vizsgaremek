import { zodResolver } from "@hookform/resolvers/zod";
import { updateCalendar } from "@repo/api";
import { components } from "@repo/types";
import { StyledButton, StyledInput } from "@repo/ui";
import { Check, X } from "@tamagui/lucide-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { Form, Spinner, Text, Theme, useTheme, XStack, YStack } from "tamagui";
import z from "zod";
import ColorSelect from "./ColorSelect";

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

// function ColorSelectItem({
// 	color,
// 	index,
// }: {
// 	color: ThemeColor;
// 	index: number;
// 	isSelected: boolean;
// }) {
// 	const [isHovered, setIsHovered] = useState(false);

// 	return (
// 		<Select.Item
// 			unstyled
// 			index={index}
// 			value={(index + 1).toString()}
// 			flexBasis={0}
// 			style={
// 				isHovered
// 					? {
// 							outlineWidth: 2,
// 							outlineOffset: -2,
// 							outlineColor: "var(--accent9)",
// 							outlineStyle: "solid",
// 							borderRadius: 9,
// 						}
// 					: {}
// 			}
// 			onHoverIn={() => setIsHovered(true)}
// 			onHoverOut={() => setIsHovered(false)}
// 		>
// 			<Select.ItemText>
// 				<View
// 					style={{
// 						width: 20,
// 						height: 20,
// 						backgroundColor: color.val,
// 						borderRadius: "5.5px",
// 					}}
// 				/>
// 			</Select.ItemText>
// 		</Select.Item>
// 	);
// }

export function UpdateCalendarForm({
	onCancel,
	onSuccess,
	calendar,
}: {
	onCancel?: () => void;
	onSuccess?: () => void;
	calendar: {
		name?: string | null | undefined;
		color?: number | undefined;
		id?: string | undefined;
	};
}) {
	const theme = useTheme({ name: "calendarColors" });
	const queryClient = useQueryClient();
	// const colors = useRef<Record<string, ThemeColor>>({
	// 	"1": theme.color1,
	// 	"2": theme.color2,
	// 	"3": theme.color3,
	// 	"4": theme.color4,
	// 	"5": theme.color5,
	// 	"6": theme.color6,
	// 	"7": theme.color7,
	// 	"8": theme.color8,
	// 	"9": theme.color9,
	// 	"10": theme.color10,
	// 	"11": theme.color11,
	// 	"12": theme.color12,
	// });

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

	return (
		<Form>
			<YStack px={15} pt={5} gap={"$2"}>
				<XStack
					gap={"$2"}
					bg="$color2"
					style={{
						borderRadius: 10,
					}}
				>
					<Controller
						control={control}
						name="color"
						render={({ field: { onChange, value } }) => (
							<ColorSelect value={value} onChange={onChange} />
						)}
					/>
					<Controller
						control={control}
						name="name"
						render={({
							field: { onChange, onBlur, value, ref },
						}) => (
							<YStack flex={1}>
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
				</XStack>
				<XStack gap={"$2"} style={{ width: "100%" }}>
					<StyledButton
						flex={20}
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
					/>
					<StyledButton
						icon={X}
						scaleIcon={1.5}
						flex={1}
						onPress={onCancel}
					/>
				</XStack>
			</YStack>
		</Form>
	);
}
