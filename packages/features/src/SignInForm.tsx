import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "@repo/api";
import { components } from "@repo/types";
import { LogIn } from "@tamagui/lucide-icons";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState, type JSX } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, Input, Spinner, Text, Theme, YStack } from "tamagui";
import { z } from "zod";

type SignInRequestDTO = components["schemas"]["SignInRequestDTO"];
const signInSchema = z.object({
	email: z.string().min(1, "The email field is required"),
	password: z.string().min(1, "The password field is required"),
});

export function SignInForm(): JSX.Element {
	const [error, setError] = useState<string | null>(null);

	// TODO: Add visual validation indicators (probably a custom Input component)
	const {
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});
	0;

	const signInMutation = useMutation({
		mutationFn: signIn,
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

	async function onSubmit(request: SignInRequestDTO) {
		signInMutation.mutate(request);
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
				icon={
					signInMutation.isPending
						? () => <Spinner color="$color8" />
						: undefined
				}
				scaleIcon={1.5}
				iconAfter={<LogIn />}
			>
				<Text>Sign In</Text>
			</Button>
			{error && (
				<Theme name="error">
					<Text color="$color8">{error}</Text>
				</Theme>
			)}
		</YStack>
	);
}
