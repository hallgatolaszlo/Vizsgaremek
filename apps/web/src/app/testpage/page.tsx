"use client";

import {
    createCalendar,
    createCalendarEntry,
    getCalendar,
    getCalendarEntry,
} from "@repo/api";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { JSX } from "react";
import { Button, H1, YStack } from "tamagui";

export default function TestPage(): JSX.Element {
    const createCalendarMutation = useMutation({
        mutationFn: createCalendar,
        onSuccess: () => {
            console.log("Successfully created calendar");
        },
        onError: (err) => {
            if (err instanceof AxiosError && err.status === 400) {
                console.log(err.response?.data);
            } else {
                console.log(
                    "An unexpected error occurred. Please try again later.",
                );
            }
        },
    });
    const createCalendarEntryMutation = useMutation({
        mutationFn: createCalendarEntry,
        onSuccess: () => {
            console.log("Successfully created calendar entry");
        },
        onError: (err) => {
            if (err instanceof AxiosError && err.status === 400) {
                console.log(err.response?.data);
            } else {
                console.log(
                    "An unexpected error occurred. Please try again later.",
                );
            }
        },
    });

    return (
        <YStack>
            <H1>HELLÓÓÓÓÓÓÓÓÓÓÓ</H1>
            <Button
                onPress={() =>
                    createCalendarMutation.mutate({ name: "nemtom", color: 1 })
                }
            >
                Adj hozzá calendart
            </Button>
            <Button
                onPress={() =>
                    createCalendarEntryMutation.mutate({
                        entryCategory: 0,
                        name: "alma",
                        startDate: new Date().toISOString(),
                        color: 1,
                        calendarId: "d95faf01-e1e5-4c5a-b7e1-c68a5f930b3f",
                    })
                }
            >
                Adj hozzá entryt
            </Button>
            <Button onPress={() => console.log(getCalendar())}>Naptárak</Button>
            <Button
                onPress={() =>
                    console.log(
                        getCalendarEntry(
                            "d95faf01-e1e5-4c5a-b7e1-c68a5f930b3f",
                        ),
                    )
                }
            >
                Entryk
            </Button>
        </YStack>
    );
}
