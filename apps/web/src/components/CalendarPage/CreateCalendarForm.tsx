import { zodResolver } from "@hookform/resolvers/zod";
import { createCalendar } from "@repo/api";
import { components } from "@repo/types";
import { StyledButton, StyledInput } from "@repo/ui";
import { Check } from "@tamagui/lucide-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Form, Spinner, Text, Theme, XStack, YStack } from "tamagui";
import z from "zod";
import ColorSelect from "./ColorSelect";

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

export function CreateCalendarForm({ onSuccess }: { onSuccess?: () => void }) {
	const [error, setError] = useState<string | null>(null);

	const queryClient = useQueryClient();

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
			queryClient.invalidateQueries({ queryKey: ["calendarEntries"] });
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
				bg="$color2"
				p="$2"
				borderWidth={2}
				borderColor="$color5"
				borderRadius="$2"
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
