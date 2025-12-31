import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "@repo/api/auth";
import { components } from "@repo/types";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { LogIn } from "lucide-react";
import { useState, type JSX } from "react";
import { useForm } from "react-hook-form";
import { Button, Form, Input, Spinner, Text, YStack } from "tamagui";
import { z } from "zod";

type SignInRequestDTO = components["schemas"]["SignInRequestDTO"];
const SignInSchema = z.object({
	email: z.string().min(1, "The email field is required"),
	password: z.string().min(1, "The password field is required"),
});

export default function SignInForm(): JSX.Element {
	const [error, setError] = useState<string | null>(null);

	// TODO: Add visual validation indicators (probably a custom Input component)
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(SignInSchema),
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
		<Form onSubmit={handleSubmit(onSubmit)}>
			<YStack>
				<Input
					placeholder="Email address"
					type="email"
					{...register("email")}
				/>
				<Input
					placeholder="Password"
					type="password"
					{...register("password")}
				/>
				{error && (
					<Text
						style={{
							color: "#d32f2f",
							textAlign: "center",
							fontWeight: "bold",
						}}
					>
						{error}
					</Text>
				)}
				<Form.Trigger asChild disabled={signInMutation.isPending}>
					<Button
						icon={
							signInMutation.isPending
								? () => <Spinner />
								: undefined
						}
						scaleIcon={1.5}
						iconAfter={<LogIn />}
					>
						<Text>Sign In</Text>
					</Button>
				</Form.Trigger>
			</YStack>
		</Form>
	);
}
