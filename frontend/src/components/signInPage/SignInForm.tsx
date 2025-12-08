import Email from "@mui/icons-material/Email";
import Login from "@mui/icons-material/Login";
import Password from "@mui/icons-material/Password";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { AxiosError } from "axios";
import { useState, type JSX } from "react";
import { useForm } from "react-hook-form";
import api from "../../services/api";

type SignInInputs = {
    email: string;
    password: string;
};

function SignInForm(): JSX.Element {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<SignInInputs>();

    async function signIn(data: SignInInputs) {
        try {
            setLoading(true);
            await api.post("api/auth/sign-in", {
                email: data.email,
                password: data.password,
            });
            reset();
            location.reload();
        } catch (error) {
            if (error instanceof AxiosError && error.status === 400) {
                setError("Invalid email or password");
            } else if (error instanceof AxiosError) {
                setError(`Error: ${error.status}`);
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit(signIn)}>
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
                    onClick={() => signIn}
                    endIcon={<Login />}
                >
                    Sign In
                </Button>
            </Stack>
        </form>
    );
}

export default SignInForm;
