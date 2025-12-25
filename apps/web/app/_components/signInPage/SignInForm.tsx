import { zodResolver } from "@hookform/resolvers/zod";
import Email from "@mui/icons-material/Email";
import Login from "@mui/icons-material/Login";
import Password from "@mui/icons-material/Password";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import signIn from "@repo/api/auth/signIn";
import { components } from "@repo/types";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState, type JSX } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type SignInRequestDTO = components["schemas"]["SignInRequestDTO"];
const SignInSchema = z.object({
	email: z.string().min(1, "The email field is required"),
	password: z.string().min(1, "The password field is required"),
});

export default function SignInForm(): JSX.Element {
	const [error, setError] = useState<string | null>(null);

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
					loading={signInMutation.isPending}
					loadingPosition="start"
					type="submit"
					variant="contained"
					endIcon={<Login />}
				>
					Sign In
				</Button>
			</Stack>
		</form>
	);
}
