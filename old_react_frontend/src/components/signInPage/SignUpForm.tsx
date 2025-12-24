import Create from "@mui/icons-material/Create";
import Email from "@mui/icons-material/Email";
import Password from "@mui/icons-material/Password";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { AxiosError } from "axios";
import { useState, type JSX } from "react";
import { useForm } from "react-hook-form";
import api from "../../services/api";

type Inputs = {
    email: string;
    password: string;
};

function SignUpForm(): JSX.Element {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<Inputs>();

    async function signUp(data: Inputs) {
        try {
            setLoading(true);
            await api.post("api/auth/sign-up", {
                email: data.email,
                password: data.password,
            });
            await api.post("api/auth/sign-in", {
                email: data.email,
                password: data.password,
            });
            reset();
            location.reload();
        } catch (error) {
            if (error instanceof AxiosError) {
                setError(`Error: ${error.status}`);
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit(signUp)}>
            <Stack direction="column" spacing={3}>
                <TextField
                    id="email"
                    label="Email"
                    variant="outlined"
                    type="email"
                    required
                    error={!!errors.email}
                    helperText={errors.email && errors.email.message}
                    {...register("email", {
                        required: "The email field is required",
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Invalid email address",
                        },
                    })}
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
                    {...register("password", {
                        required: "The password field is required",
                        minLength: {
                            value: 8,
                            message:
                                "The password should be at least 8 characters long",
                        },
                        maxLength: {
                            value: 128,
                            message:
                                "The password should be at most 128 characters long",
                        },
                        validate: {
                            hasLowerCase: (value) =>
                                /[a-z]/.test(value) ||
                                "At least 1 lowercase character",
                            hasUpperCase: (value) =>
                                /[A-Z]/.test(value) ||
                                "At least 1 uppercase character",
                            hasNumber: (value) =>
                                /\d/.test(value) || "At least 1 digit",
                            hasSpecialChar: (value) =>
                                /[\W_]/.test(value) ||
                                "At least 1 special character",
                        },
                    })}
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
                    loading={loading}
                    loadingPosition="start"
                    type="submit"
                    variant="contained"
                    onClick={() => signUp}
                    endIcon={<Create />}
                >
                    Sign Up
                </Button>
            </Stack>
        </form>
    );
}

export default SignUpForm;
