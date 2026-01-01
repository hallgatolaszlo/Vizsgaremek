import { zodResolver } from "@hookform/resolvers/zod";
import { signIn, signUp } from "@repo/api";
import { components } from "@repo/types";
import { UserPlus } from "@tamagui/lucide-icons";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState, type JSX } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, Input, Spinner, Text, Theme, YStack } from "tamagui";
import z from "zod";

type SignUpRequestDTO = components["schemas"]["SignUpRequestDTO"];
const signUpSchema = z.object({
	email: z
		.string()
		.min(1, "The email field is required")
		.email("Invalid email address"),
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

export function SignUpForm(): JSX.Element {
	const [error, setError] = useState<string | null>(null);

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

	const signUpMutation = useMutation({
		mutationFn: async (request: SignUpRequestDTO) => {
			await signUp(request);
			await signIn(request);
		},
		onSuccess: () => {
			reset();
		},
		onError: (err) => {
			if (err instanceof AxiosError && err.status === 400) {
				setError(err.response?.data);
			} else {
				setError(
					"An unexpected error occurred. Please try again later."
				);
			}
		},
	});

	async function onSubmit(request: SignUpRequestDTO) {
		signUpMutation.mutate(request);
	}

	return (
		<YStack>
			<Controller
				control={control}
				name="email"
				render={({ field: { onChange, onBlur, value } }) => (
					<Input
						placeholder="Email address"
						onBlur={onBlur}
						onChange={onChange}
						value={value}
					/>
				)}
			/>
			{errors.email && (
				<Theme name="error">
					<Text color="$color8">{errors.email.message}</Text>
				</Theme>
			)}
			<Controller
				control={control}
				name="password"
				render={({ field: { onChange, onBlur, value } }) => (
					<Input
						placeholder="Password"
						type="password"
						secureTextEntry
						onBlur={onBlur}
						onChange={onChange}
						value={value}
					/>
				)}
			/>
			{errors.password && (
				<Theme name="error">
					<Text color="$color8">{errors.password.message}</Text>
				</Theme>
			)}
			<Button
				onPress={handleSubmit(onSubmit)}
				icon={signUpMutation.isPending ? () => <Spinner /> : undefined}
				scaleIcon={1.5}
				iconAfter={<UserPlus />}
			>
				<Text>Sign Up</Text>
			</Button>
			{error && (
				<Theme name="error">
					<Text color="$color8">{error}</Text>
				</Theme>
			)}
		</YStack>
	);
}
