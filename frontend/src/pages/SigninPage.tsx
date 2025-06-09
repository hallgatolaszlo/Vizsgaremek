import { type JSX } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Hr from "../components/signin/Hr.tsx";
import LabelledCheckbox from "../components/signin/LabelledCheckbox.tsx";
import LabelledTextInput from "../components/signin/LabelledTextInput.tsx";
import SubmitButton from "../components/signin/SubmitButton.tsx";
import "../css/SignInPage.css";
import api from "../services/api.ts";

type LoginFormInputs = {
    email_username: string;
    password: string;
    rememberMe: boolean;
};

function SigninPage(): JSX.Element {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormInputs>();

    const onSubmit = async (data: LoginFormInputs) => {
        const username = data.email_username;
        const password = data.password;
        try {
            const res = await api.post("/api/token/get/", {
                username,
                password,
            });
            console.log(res);
            navigate("/daily-journal");
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
                <h1 className="font-semibold text-nowrap text-center leading-[100%] title-font text-color-1 text-[90px] check-in-header">
                    Check in
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
                            label="Email/Username:"
                            placeholder="Enter your email/username"
                            register={register("email_username", {
                                required: "Email/username is required",
                            })}
                        ></LabelledTextInput>
                        {errors.email_username && (
                            <span className="text-color-2">
                                {errors.email_username.message}
                            </span>
                        )}
                        <LabelledTextInput
                            type="password"
                            label="Password:"
                            placeholder="Enter your password"
                            register={register("password", {
                                required: "Password is required",
                            })}
                        ></LabelledTextInput>
                        {errors.password && (
                            <span className="text-color-2">
                                {errors.password.message}
                            </span>
                        )}
                    </div>
                    <div className="w-full flex flex-col items-center gap-[5px]">
                        <LabelledCheckbox
                            label="Remember Me"
                            register={register("rememberMe")}
                        ></LabelledCheckbox>
                        <a className="font-semibold text-center text-color-1 text-font underline text-[20px]">
                            I forgot my password
                        </a>
                    </div>
                    <div className="w-full flex justify-center">
                        <SubmitButton content="Sign in"></SubmitButton>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SigninPage;
