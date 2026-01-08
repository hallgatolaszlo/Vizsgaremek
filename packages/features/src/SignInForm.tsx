import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "@repo/api";
import { components } from "@repo/types";
import { LogIn } from "@tamagui/lucide-icons";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRef, useState, type JSX } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, Form, Input, Spinner, Text, Theme, YStack } from "tamagui";
import { z } from "zod";

type SignInRequestDTO = components["schemas"]["SignInRequestDTO"];
const signInSchema = z.object({
	email: z.string().min(1, "The email field is required"),
	password: z.string().min(1, "The password field is required"),
});

export function SignInForm({
	onSuccessfulSignIn,
}: {
	onSuccessfulSignIn: () => void;
}): JSX.Element {
	const [error, setError] = useState<string | null>(null);
	const passwordRef = useRef<any>(null);

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
			onSuccessfulSignIn();
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
			<Form>
				<Controller
					control={control}
					name="email"
					render={({ field: { onChange, onBlur, value, ref } }) => (
						<Input
							ref={ref}
							placeholder="Email address"
							onBlur={onBlur}
							onChange={onChange}
							value={value}
							returnKeyType="next"
							onSubmitEditing={() => passwordRef.current?.focus()}
						/>
					)}
				/>
				{errors.email && (
					<Theme name="error">
						<Text color="$color12">{errors.email.message}</Text>
					</Theme>
				)}
				<Controller
					control={control}
					name="password"
					render={({ field: { onChange, onBlur, value, ref } }) => (
						<Input
							ref={(input: any) => {
								ref(input);
								passwordRef.current = input;
							}}
							placeholder="Password"
							type="password"
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
					<Theme name="error">
						<Text color="$color12">{errors.password.message}</Text>
					</Theme>
				)}
				<Button
					onPress={handleSubmit(onSubmit)}
					disabled={signInMutation.isPending}
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
						<Text color="$color12">{error}</Text>
					</Theme>
				)}
			</Form>
		</YStack>
	);
}
