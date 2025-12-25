import { zodResolver } from "@hookform/resolvers/zod";
import Create from "@mui/icons-material/Create";
import Email from "@mui/icons-material/Email";
import Password from "@mui/icons-material/Password";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import signIn from "@repo/api/auth/signIn";
import signUp from "@repo/api/auth/signUp";
import { components } from "@repo/types";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState, type JSX } from "react";
import { useForm } from "react-hook-form";
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
		<form onSubmit={handleSubmit(onSubmit)}>
			<Stack direction="column" spacing={3}>
				<TextField
					id="email"
					label="Email"
					variant="outlined"
					type="email"
					required
					error={!!errors.email}
					helperText={errors.email && errors.email.message}
					{...register("email")}
					slotProps={{
						input: {
							startAdornment: (
								<InputAdornment position="start">
									<Email />
								</InputAdornment>
							),
						},
					}}
				/>
				<TextField
					id="password"
					label="Password"
					variant="outlined"
					type="password"
					required
					error={!!errors.password}
					helperText={errors.password && errors.password.message}
					{...register("password")}
					slotProps={{
						input: {
							startAdornment: (
								<InputAdornment position="start">
									<Password />
								</InputAdornment>
							),
						},
					}}
				/>

				{error && (
					<span
						style={{
							color: "#d32f2f",
							textAlign: "center",
							fontWeight: "bold",
						}}
					>
						{error}
					</span>
				)}
				<Button
					loading={signUpMutation.isPending}
					loadingPosition="start"
					type="submit"
					variant="contained"
					endIcon={<Create />}
				>
					Sign Up
				</Button>
			</Stack>
		</form>
	);
}

export default SignUpForm;
