import { type JSX } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Hr from "../components/signin/Hr.tsx";
import LabelledCheckbox from "../components/signin/LabelledCheckbox.tsx";
import LabelledTextInput from "../components/signin/LabelledTextInput.tsx";
import SubmitButton from "../components/signin/SubmitButton.tsx";
import api from "../services/api.ts";

type SignupFormInputs = {
    username: string;
    email: string;
    password: string;
    confirmPassword?: string;
    tos?: boolean;
    privacyPolicy?: boolean;
};

function SignupPage(): JSX.Element {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<SignupFormInputs>();

    const onSubmit = async (data: SignupFormInputs) => {
        const username = data.username;
        const email = data.email;
        const password = data.password;
        try {
            const res = await api.post("api/auth/register", {
                username,
                email,
                password,
            });
            console.log(res);
            navigate("/sign-in");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="p-[25px] flex justify-center items-center bg-color-1 min-h-screen">
            <div
                style={{ border: "3px solid var(--btn-color-1)" }}
                className="p-[25px] gap-7 flex flex-col items-center rounded-[20px] bg-color-2 w-full h-fit max-w-[500px] login-card"
            >
                <h1 className="font-semibold text-center leading-[100%] title-font text-color-1 text-[46px]">
                    Create your account
                </h1>
                <div className="w-full">
                    <Hr />
                </div>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex items-center flex-col gap-[30px] max-w-[350px] w-full"
                >
                    <div className="w-full flex flex-col gap-[10px]">
                        <LabelledTextInput
                            label="Username*"
                            placeholder="Enter your username"
                            register={register("username", {
                                required: "Username is required",
                            })}
                        ></LabelledTextInput>
                        {errors.username && (
                            <span className="text-color-2">
                                {errors.username.message}
                            </span>
                        )}
                        <LabelledTextInput
                            label="Email*"
                            placeholder="Enter your email"
                            register={register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: "Enter a valid email address",
                                },
                            })}
                        ></LabelledTextInput>
                        {errors.email && (
                            <span className="text-color-2">
                                {errors.email.message}
                            </span>
                        )}
                        <LabelledTextInput
                            type="password"
                            label="Password*"
                            placeholder="Enter your password"
                            register={register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 8,
                                    message:
                                        "Password must have at least 8 characters",
                                },
                            })}
                        ></LabelledTextInput>
                        {errors.password && (
                            <span className="text-color-2">
                                {errors.password.message}
                            </span>
                        )}
                        <LabelledTextInput
                            type="password"
                            label="Confirm password*"
                            placeholder="Enter your password again"
                            register={register("confirmPassword", {
                                required: "Confirm password required",
                                validate: (value) =>
                                    value === watch("password") ||
                                    "Passwords do not match",
                            })}
                        ></LabelledTextInput>
                        {errors.confirmPassword && (
                            <span className="text-color-2">
                                {errors.confirmPassword.message}
                            </span>
                        )}
                    </div>
                    <div className="w-full flex flex-col items-start gap-[10px]">
                        <LabelledCheckbox
                            label="*I agree to the Terms of Service"
                            register={register("tos", {
                                validate: (value) =>
                                    value === true ||
                                    "You must accept the Terms of Service",
                            })}
                        ></LabelledCheckbox>
                        {errors.tos && (
                            <span className="text-color-2">
                                {errors.tos.message}
                            </span>
                        )}
                        <LabelledCheckbox
                            label="*I have read and agree to the Privacy Policy, including how my data will be collected, used, and stored"
                            register={register("privacyPolicy", {
                                validate: (value) =>
                                    value === true ||
                                    "You must accept the Privacy Policy",
                            })}
                        ></LabelledCheckbox>
                        {errors.privacyPolicy && (
                            <span className="text-color-2">
                                {errors.privacyPolicy.message}
                            </span>
                        )}
                    </div>
                    <div className="w-full flex justify-center">
                        <SubmitButton content="Sign up"></SubmitButton>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SignupPage;
