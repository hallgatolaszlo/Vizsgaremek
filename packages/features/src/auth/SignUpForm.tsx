"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn, signUp } from "@repo/api";
import { components } from "@repo/types";
import { StyledButton, StyledInput } from "@repo/ui";
import { UserPlus } from "@tamagui/lucide-icons";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Form, Spinner, Text, Theme, YStack } from "tamagui";
import z from "zod";

// Type for sign-up request data from Swagger
type SignUpRequestDTO = components["schemas"]["SignUpRequestDTO"];

// Zod schema for sign-up form validation
const signUpSchema = z.object({
	email: z
		.email("Invalid email address")
		.min(1, "The email field is required"),
	password: z
		.string()
		.min(1, "The password field is required")
		.min(8, "The password should be at least 8 characters long")
		.max(128, "The password should be at most 128 characters long")
		.regex(/[a-z]/, "At least 1 lowercase character")
		.regex(/[A-Z]/, "At least 1 uppercase character")
		.regex(/\d/, "At least 1 digit")
		.regex(/[\W_]/, "At least 1 special character"),
});

// Component to display error messages
const ErrorText = ({ message }: { message: string | undefined }) => (
	<Theme name="error">
		<Text pl="$1" fontSize="$1" color="$color9">
			{message}
		</Text>
	</Theme>
);

export function SignUpForm() {
	const [error, setError] = useState<string | null>(null);
	const passwordRef = useRef<any>(null);

	const {
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});
	0;

	// Mutation for sign-up action
	const signUpMutation = useMutation({
		mutationFn: async (request: SignUpRequestDTO) => {
			await signUp(request);
			await signIn(request);
			window.location.href = "/calendar";
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

	async function onSubmit(request: SignUpRequestDTO) {
		signUpMutation.mutate(request);
	}

	return (
		<YStack>
			<Form gap="$3">
				<YStack gap="$2">
					<Controller
						control={control}
						name="email"
						render={({
							field: { onChange, onBlur, value, ref },
						}) => (
							<StyledInput
								ref={ref}
								placeholder="Email address"
								onBlur={onBlur}
								onChange={onChange}
								value={value}
								returnKeyType="next"
								onSubmitEditing={() =>
									passwordRef.current?.focus()
								}
								autoFocus
							/>
						)}
					/>
					{errors.email && (
						<ErrorText message={errors.email.message} />
					)}
				</YStack>
				<YStack gap="$2">
					<Controller
						control={control}
						name="password"
						render={({
							field: { onChange, onBlur, value, ref },
						}) => (
							<StyledInput
								ref={(input: any) => {
									ref(input);
									passwordRef.current = input;
								}}
								placeholder="Password"
								secureTextEntry
								onBlur={onBlur}
								onChange={onChange}
								value={value}
								returnKeyType="done"
								onSubmitEditing={handleSubmit(onSubmit)}
							/>
						)}
					/>
					{errors.password && (
						<ErrorText message={errors.password.message} />
					)}
				</YStack>
				<StyledButton
					onPress={handleSubmit(onSubmit)}
					disabled={signUpMutation.isPending}
					icon={
						signUpMutation.isPending
							? () => <Spinner color="$color12" />
							: undefined
					}
					scaleIcon={1.5}
					iconAfter={
						!signUpMutation.isPending ? <UserPlus /> : undefined
					}
				>
					{!signUpMutation.isPending && (
						<Text style={{ userSelect: "none" }}>Sign Up</Text>
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
