import { zodResolver } from "@hookform/resolvers/zod";
import { signIn, signUp } from "@repo/api/auth";
import { components } from "@repo/types";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { UserPlus } from "lucide-react";
import { useState, type JSX } from "react";
import { useForm } from "react-hook-form";
import { Button, Form, Input, Spinner, Text, YStack } from "tamagui";
import z from "zod";

type SignUpRequestDTO = components["schemas"]["SignUpRequestDTO"];
const signUpSchema = z.object({
	email: z
		.string()
		.min(1, "The email field is required")
		.email("Invalid email address"),
	password: z
		.string()
		.min(8, "The password should be at least 8 characters long")
		.max(128, "The password should be at most 128 characters long")
		.regex(/[a-z]/, "At least 1 lowercase character")
		.regex(/[A-Z]/, "At least 1 uppercase character")
		.regex(/\d/, "At least 1 digit")
		.regex(/[\W_]/, "At least 1 special character"),
});

function SignUpForm(): JSX.Element {
	const [error, setError] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({ resolver: zodResolver(signUpSchema) });

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
				<Form.Trigger asChild disabled={signUpMutation.isPending}>
					<Button
						icon={
							signUpMutation.isPending
								? () => <Spinner />
								: undefined
						}
						scaleIcon={1.5}
						iconAfter={<UserPlus />}
					>
						<Text>Sign Up</Text>
					</Button>
				</Form.Trigger>
			</YStack>
		</Form>
	);
}

export default SignUpForm;
