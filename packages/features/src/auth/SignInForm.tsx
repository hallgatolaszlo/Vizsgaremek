"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "@repo/api";
import { components } from "@repo/types";
import { StyledButton, StyledInput } from "@repo/ui";
import { LogIn } from "@tamagui/lucide-icons";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Form, Spinner, Text, Theme, YStack } from "tamagui";
import { z } from "zod";
import { useNotificationStore } from "@repo/hooks";

// Type for sign-in request data from Swagger
type SignInRequestDTO = components["schemas"]["SignInRequestDTO"];

// Zod schema for sign-in form validation
const signInSchema = z.object({
    email: z.string().min(1, "The email field is required"),
    password: z.string().min(1, "The password field is required"),
});

// Component to display error messages
const ErrorText = ({ message }: { message: string | undefined }) => (
    <Theme name="error">
        <Text pl="$1" fontSize="$1" color="$color9">
            {message}
        </Text>
    </Theme>
);

export function SignInForm({
    onSuccessfulSignIn,
}: {
    onSuccessfulSignIn: () => void;
}) {
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

    // Mutation for sign-in action
    const signInMutation = useMutation({
        mutationFn: signIn,
        onSuccess: async () => {
            reset();
            onSuccessfulSignIn();
        },
        onError: (err) => {
            if (err instanceof AxiosError && err.status === 400) {
                setError(err.response?.data);
            } else {
                setError(
                    "An unexpected error occurred. Please try again later.",
                );
            }
        },
    });

    async function onSubmit(request: SignInRequestDTO) {
        signInMutation.mutate(request);
    }

    return (
        <YStack>
            <Form gap="$3">
                <YStack gap="$2">
                    <Controller
                        control={control}
                        name="email"
                        render={({
                            field: { onChange, onBlur, value, ref },
                        }) => (
                            <StyledInput
                                ref={ref}
                                placeholder="Email address"
                                onBlur={onBlur}
                                onChange={onChange}
                                value={value}
                                returnKeyType="next"
                                onSubmitEditing={() =>
                                    passwordRef.current?.focus()
                                }
                                autoFocus
                            />
                        )}
                    />
                    {errors.email && (
                        <ErrorText message={errors.email.message} />
                    )}
                </YStack>
                <YStack gap="$2">
                    <Controller
                        control={control}
                        name="password"
                        render={({
                            field: { onChange, onBlur, value, ref },
                        }) => (
                            <StyledInput
                                ref={(input: any) => {
                                    ref(input);
                                    passwordRef.current = input;
                                }}
                                placeholder="Password"
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
                        <ErrorText message={errors.password.message} />
                    )}
                </YStack>
                <StyledButton
                    onPress={handleSubmit(onSubmit)}
                    disabled={signInMutation.isPending}
                    icon={
                        signInMutation.isPending
                            ? () => <Spinner color="$color12" />
                            : undefined
                    }
                    scaleIcon={1.5}
                    iconAfter={
                        !signInMutation.isPending ? <LogIn /> : undefined
                    }
                >
                    {!signInMutation.isPending && (
                        <Text style={{ userSelect: "none" }}>Sign In</Text>
                    )}
                </StyledButton>
                {error && (
                    <Theme name="error">
                        <Text style={{ textAlign: "center" }} color="$color9">
                            {error}
                        </Text>
                    </Theme>
                )}
            </Form>
        </YStack>
    );
}
