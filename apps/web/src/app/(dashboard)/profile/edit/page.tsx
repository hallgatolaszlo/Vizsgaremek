"use client";

import { deleteCalendar, updateProfile } from "@repo/api";
import { useCalendars, useProfile } from "@repo/hooks";
import { components } from "@repo/types";
import { StyledInput } from "@repo/ui";
import { Check, Save, Trash2 } from "@tamagui/lucide-icons";
import { useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
    Button,
    Checkbox,
    Separator,
    Text,
    View,
    XStack,
    YStack,
    useTheme,
} from "tamagui";

type GetProfileDTO = components["schemas"]["GetProfileDTO"];
type UpdateProfileDTO = components["schemas"]["UpdateProfileDTO"];
type GetCalendarDTO = components["schemas"]["GetCalendarDTO"];

const MONTH_LABELS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];

const compactDatepickerButtonStyle = {
    border: "1px solid var(--color6)",
    background: "var(--color3)",
    color: "var(--color12)",
    borderRadius: "6px",
    minWidth: "28px",
    height: "28px",
    lineHeight: 1,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    fontWeight: 700,
} as const;

// Wrapper: waits for data to load, then mounts the form with correct initial values.
export default function EditProfilePage() {
    const { isPending, error, data } = useProfile();

    if (isPending) {
        return <Text>Loading...</Text>;
    }

    if (error) {
        return (
            <Text>
                Error:{" "}
                {error instanceof Error ? error.message : "Unknown error"}
            </Text>
        );
    }

    return <EditForm key={data?.id} data={data!} />;
}

function EditForm({ data }: { data: GetProfileDTO }) {
    const { data: calendars } = useCalendars();
    const queryClient = useQueryClient();
    const router = useRouter();
    const calendarTheme = useTheme({ name: "calendarColors" });

    const [saveError, setSaveError] = useState<string | null>(null);
    const [username, setUsername] = useState(data.username || "");
    const [firstName, setFirstName] = useState(data.firstName || "");
    const [lastName, setLastName] = useState(data.lastName || "");
    const [birthDate, setBirthDate] = useState<Date | null>(
        data.birthDate ? new Date(data.birthDate) : null,
    );
    const [isPrivate, setIsPrivate] = useState(data.isPrivate || false);

    async function saveProfile() {
        const payload: UpdateProfileDTO = {
            id: data.id,
            username,
            avatar: data.avatar || "",
            isPrivate,
            firstName,
            lastName,
            birthDate: birthDate ? birthDate.toISOString().split("T")[0] : null,
            email: data.userEmail || "",
        };

        try {
            await updateProfile(payload);
            queryClient.invalidateQueries({ queryKey: ["profile"] });
            setSaveError(null);
            router.push("/profile");
        } catch (err) {
            if (err instanceof AxiosError) {
                const serverMessage = err.response?.data;
                setSaveError(
                    typeof serverMessage === "string"
                        ? serverMessage
                        : "Failed to update profile",
                );
            } else {
                setSaveError("An unknown error occurred");
            }
        }
    }

    async function handleDeleteCalendar(id: string) {
        await deleteCalendar(id);
        queryClient.invalidateQueries({ queryKey: ["myCalendars"] });
    }

    function getChipColor(cal: GetCalendarDTO) {
        const colorKey = `color${cal.color}` as keyof typeof calendarTheme;
        return calendarTheme[colorKey]?.val ?? "#888";
    }

    return (
        <YStack
            gap="$4"
            p="$6"
            maxWidth={600}
            width="100%"
            minHeight="calc(100vh - var(--navbar-height))"
            height="fit-content"
            alignSelf="center"
            justifyContent="center"
        >
            <Text fontSize="$6" fontWeight="bold">
                Edit Profile
            </Text>

            <YStack gap="$3">
                <XStack alignItems="center" gap="$3">
                    <Text width={100}>Username</Text>
                    <StyledInput
                        flex={1}
                        value={username}
                        onChangeText={setUsername}
                        placeholder="Enter username"
                    />
                </XStack>

                <XStack alignItems="center" gap="$3">
                    <Text width={100}>First Name</Text>
                    <StyledInput
                        flex={1}
                        value={firstName}
                        onChangeText={setFirstName}
                        placeholder="Enter first name"
                    />
                </XStack>

                <XStack alignItems="center" gap="$3">
                    <Text width={100}>Last Name</Text>
                    <StyledInput
                        flex={1}
                        value={lastName}
                        onChangeText={setLastName}
                        placeholder="Enter last name"
                    />
                </XStack>

                <XStack alignItems="center" gap="$3">
                    <Text width={100}>Email</Text>
                    <YStack flex={1} gap="$1">
                        <StyledInput
                            flex={1}
                            value={data.userEmail || ""}
                            readOnly
                            cursor="not-allowed"
                            opacity={0.75}
                        />
                        <Text fontSize="$3" color="$color10">
                            Email address cannot be changed.
                        </Text>
                    </YStack>
                </XStack>

                <XStack alignItems="center" gap="$3" flexWrap="wrap">
                    <Text width={100} flexShrink={0}>
                        Birth Date
                    </Text>
                    <View flex={1} minWidth={0} width="100%">
                        <DatePicker
                            wrapperClassName="custom-datepicker-wrapper profile-datepicker-wrapper"
                            className="custom-datepicker profile-datepicker"
                            popperClassName="profile-datepicker-popper"
                            popperPlacement="bottom-start"
                            selected={birthDate}
                            onChange={(date: Date | null) => setBirthDate(date)}
                            dateFormat="yyyy-MM-dd"
                            placeholderText="Select your birth date"
                            renderCustomHeader={({
                                date,
                                decreaseMonth,
                                increaseMonth,
                                decreaseYear,
                                increaseYear,
                                prevMonthButtonDisabled,
                                nextMonthButtonDisabled,
                            }) => (
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        gap: "6px",
                                        padding: "6px",
                                        backgroundColor: "var(--color2)",
                                        color: "var(--color12)",
                                    }}
                                >
                                    <button
                                        type="button"
                                        onClick={decreaseYear}
                                        style={compactDatepickerButtonStyle}
                                        aria-label="Previous year"
                                    >
                                        «
                                    </button>
                                    <button
                                        type="button"
                                        onClick={decreaseMonth}
                                        disabled={prevMonthButtonDisabled}
                                        style={compactDatepickerButtonStyle}
                                        aria-label="Previous month"
                                    >
                                        ‹
                                    </button>
                                    <span
                                        style={{
                                            flex: 1,
                                            textAlign: "center",
                                            fontWeight: 700,
                                            fontSize: "0.95rem",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {MONTH_LABELS[date.getMonth()]}{" "}
                                        {date.getFullYear()}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={increaseMonth}
                                        disabled={nextMonthButtonDisabled}
                                        style={compactDatepickerButtonStyle}
                                        aria-label="Next month"
                                    >
                                        ›
                                    </button>
                                    <button
                                        type="button"
                                        onClick={increaseYear}
                                        style={compactDatepickerButtonStyle}
                                        aria-label="Next year"
                                    >
                                        »
                                    </button>
                                </div>
                            )}
                        />
                    </View>
                </XStack>

                <XStack alignItems="center" gap="$3">
                    <Text width={100}>Private</Text>
                    <Checkbox
                        checked={isPrivate}
                        onCheckedChange={(checked) =>
                            setIsPrivate(checked === true)
                        }
                        size="$4"
                        backgroundColor={isPrivate ? "$accent8" : "$color3"}
                        borderColor={isPrivate ? "$accent8" : "$color7"}
                        borderWidth={2}
                        hoverStyle={{
                            backgroundColor: isPrivate ? "$accent7" : "$color4",
                            borderColor: isPrivate ? "$accent7" : "$color8",
                        }}
                        focusStyle={{
                            backgroundColor: isPrivate ? "$accent7" : "$color4",
                            borderColor: isPrivate ? "$accent7" : "$color8",
                        }}
                    >
                        <Checkbox.Indicator>
                            <Check color="white" strokeWidth={3} />
                        </Checkbox.Indicator>
                    </Checkbox>
                </XStack>
            </YStack>

            <Separator />

            <YStack gap="$2">
                <Text fontSize="$4" fontWeight="bold">
                    My Calendars
                </Text>
                {!calendars || calendars.length === 0 ? (
                    <YStack gap="$2" alignItems="flex-start">
                        <Text color="$color10">No calendars yet.</Text>
                        <Button
                            size="$3"
                            onPress={() => router.push("/calendar")}
                        >
                            Go to Calendar
                        </Button>
                    </YStack>
                ) : (
                    calendars.map((cal) => (
                        <XStack
                            key={cal.id}
                            alignItems="center"
                            justifyContent="space-between"
                            gap="$2"
                            paddingHorizontal="$3"
                            paddingVertical="$2"
                            borderRadius="$4"
                            backgroundColor="$color4"
                            borderWidth={1}
                            borderColor="$color7"
                        >
                            <XStack
                                alignItems="center"
                                gap="$2"
                                flex={1}
                                minWidth={0}
                            >
                                <View
                                    width={12}
                                    height={12}
                                    borderRadius={6}
                                    backgroundColor={getChipColor(cal)}
                                    flexShrink={0}
                                />
                                <Text flexShrink={1} numberOfLines={1}>
                                    {cal.name}
                                </Text>
                            </XStack>
                            <Button
                                size="$2"
                                icon={Trash2}
                                theme="error"
                                flexShrink={0}
                                onPress={() => handleDeleteCalendar(cal.id!)}
                            />
                        </XStack>
                    ))
                )}
            </YStack>

            <Separator />

            {saveError && <Text color="$red10">{saveError}</Text>}

            <XStack gap="$3" justifyContent="flex-end">
                <Button onPress={() => router.push("/profile")}>Cancel</Button>
                <Button icon={Save} onPress={saveProfile}>
                    Save Changes
                </Button>
            </XStack>
        </YStack>
    );
}
