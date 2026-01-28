"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { createCalendarEntry } from "@repo/api";
import { components } from "@repo/types";
import { StyledButton, StyledInput } from "@repo/ui";
import { CalendarPlus2 } from "@tamagui/lucide-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Form, Spinner, Text, Theme, YStack } from "tamagui";
import z from "zod";

// Type for sign-up request data from Swagger
type CreateCalendarEntryDTO = components["schemas"]["CreateCalendarEntryDTO"];

// Zod schema for sign-up form validation
const createCalendarEntrySchema = z.object({
	name: z
		.string()
		.min(1, "The name field is required")
		.min(3, "The name should be at least 3 characters long")
		.max(32, "The name should be at most 32 characters long"),
	description: z
		.string()
		.max(1024, "The description should be at most 1024 characters long"),
});

// Component to display error messages
const ErrorText = ({ message }: { message: string | undefined }) => (
	<Theme name="error">
		<Text pl="$1" fontSize="$1" color="$color9">
			{message}
		</Text>
	</Theme>
);

export function CreateCalendarEntryForm() {
	const [error, setError] = useState<string | null>(null);
	const descriptionRef = useRef<any>(null);
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
			description: "",
		},
	});

	// Mutation for sign-up action
	const createCalendarEntryMutation = useMutation({
		mutationFn: async (request: CreateCalendarEntryDTO) => {
			await createCalendarEntry(request);
			queryClient.invalidateQueries({ queryKey: ["calendarEntries"] });
		},
		onSuccess: () => {
			reset();
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

	async function onSubmit(request: CreateCalendarEntryDTO) {
		createCalendarEntryMutation.mutate(request);
	}

	return (
		<YStack>
			<Form gap="$3">
				<YStack gap="$2">
					<Controller
						control={control}
						name="name"
						render={({
							field: { onChange, onBlur, value, ref },
						}) => (
							<StyledInput
								ref={ref}
								placeholder="Name"
								onBlur={onBlur}
								onChange={onChange}
								value={value}
								returnKeyType="next"
								onSubmitEditing={() =>
									descriptionRef.current?.focus()
								}
								autoFocus
							/>
						)}
					/>
					{errors.name && <ErrorText message={errors.name.message} />}
				</YStack>
				<YStack gap="$2">
					<Controller
						control={control}
						name="description"
						render={({
							field: { onChange, onBlur, value, ref },
						}) => (
							<StyledInput
								ref={(input: any) => {
									ref(input);
									descriptionRef.current = input;
								}}
								placeholder="Description"
								onBlur={onBlur}
								onChange={onChange}
								value={value}
								returnKeyType="done"
								onSubmitEditing={handleSubmit(onSubmit)}
							/>
						)}
					/>
					{errors.description && (
						<ErrorText message={errors.description.message} />
					)}
				</YStack>
				<StyledButton
					onPress={handleSubmit(onSubmit)}
					disabled={createCalendarEntryMutation.isPending}
					icon={
						createCalendarEntryMutation.isPending
							? () => <Spinner color="$color12" />
							: undefined
					}
					scaleIcon={1.5}
					iconAfter={
						!createCalendarEntryMutation.isPending ? (
							<CalendarPlus2 />
						) : undefined
					}
				>
					{!createCalendarEntryMutation.isPending && (
						<Text style={{ userSelect: "none" }}>Create Entry</Text>
					)}
				</StyledButton>
				{error && (
					<Theme name="error">
						<Text style={{ textAlign: "center" }} color="$color9">
							{error}
						</Text>
					</Theme>
				)}
			</Form>
		</YStack>
	);
}
