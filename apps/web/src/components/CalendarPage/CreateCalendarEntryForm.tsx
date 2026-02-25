"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { createCalendarEntry } from "@repo/api";
import {
    useCalendars,
    useContextMenuStore,
    useProfileStore,
} from "@repo/hooks";
import { components } from "@repo/types";
import { ColorIcon, SelectElement, StyledButton, StyledInput } from "@repo/ui";
import { CalendarPlus2, Check } from "@tamagui/lucide-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRef, useState } from "react";
import { DatePicker } from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import {
    Checkbox,
    Form,
    Label,
    Select,
    Spinner,
    Text,
    Theme,
    useTheme,
    View,
    XStack,
    YStack,
} from "tamagui";
import z from "zod";
import ColorSelect from "./ColorSelect";

type GetCalendarDTO = components["schemas"]["GetCalendarDTO"];
type CreateCalendarEntryDTO = components["schemas"]["CreateCalendarEntryDTO"];
type CalendarEntryCategory = components["schemas"]["EntryCategory"];
const ENTRY_CATEGORIES: CalendarEntryCategory[] = [
    "None",
    "Task",
    "Event",
    "BirthDay",
    "Anniversary",
];

// Zod schema for sign-up form validation
const createCalendarEntrySchema = z.object({
    calendarId: z.uuid("Invalid calendar ID"),
    entryCategory: z.enum(ENTRY_CATEGORIES),
    name: z
        .string()
        .min(1, "The name field is required")
        .min(3, "The name should be at least 3 characters long")
        .max(32, "The name should be at most 32 characters long"),
    description: z
        .string()
        .max(1024, "The description should be at most 1024 characters long"),
    isAllDay: z.boolean(),
    startDate: z.date(),
    endDate: z.date().optional(),
    color: z.int().min(1).max(12),
});

// Component to display error messages
const ErrorText = ({ message }: { message: string | undefined }) => (
    <Theme name="error">
        <Text pl="$1" fontSize="$1" color="$color9">
            {message}
        </Text>
    </Theme>
);

export function CreateCalendarEntryForm() {
    const queryClient = useQueryClient();
    const myCalendars = useCalendars();

    const [error, setError] = useState<string | null>(null);
    const [selectedCalendar, setSelectedCalendar] =
        useState<GetCalendarDTO | null>(myCalendars.data?.[0] || null);
    const [useCalendarColor, setUseCalendarColor] = useState(true);

    const startDate = useContextMenuStore((state) => state.date);
    startDate?.setHours(new Date().getHours(), 0, 0, 0);
    const { locale } = useProfileStore();

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(createCalendarEntrySchema),
        defaultValues: {
            calendarId: selectedCalendar?.id || "",
            entryCategory: "None" as const,
            name: "",
            description: "",
            isAllDay: true,
            startDate: startDate!,
            endDate: new Date(startDate!.getTime() + 60 * 60 * 1000),
            color: selectedCalendar?.color || 1,
        },
    });

    const isAllDay = watch("isAllDay");

    // Mutation for sign-up action
    const createCalendarEntryMutation = useMutation({
        mutationFn: async (request: CreateCalendarEntryDTO) => {
            await createCalendarEntry(request);
            queryClient.invalidateQueries({ queryKey: ["calendarEntries"] });
        },
        onSuccess: () => {
            reset();
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

    type FormData = z.infer<typeof createCalendarEntrySchema>;

    async function onSubmit(data: FormData) {
        const startDate: Date = new Date(data.startDate);
        let endDate: Date | undefined = data.endDate
            ? new Date(data.endDate)
            : undefined;

        if (data.isAllDay) {
            startDate.setHours(0, 0, 0, 0);
            endDate = new Date(startDate);
            endDate.setHours(23, 59, 59, 999);
        } else {
            if (
                data.endDate &&
                (data.entryCategory === "Task" ||
                    data.entryCategory === "None" ||
                    data.entryCategory === "Event")
            ) {
                endDate = data.endDate!;
            }
        }

        const request: CreateCalendarEntryDTO = {
            ...data,
            color: useCalendarColor ? null : data.color,
            startDate: startDate?.toISOString(),
            endDate: endDate?.toISOString(),
        };
        createCalendarEntryMutation.mutate(request);
    }

    const theme = useTheme({ name: "calendarColors" });
    const colors = useRef<Record<string, any>>({
        "1": theme.color1,
        "2": theme.color2,
        "3": theme.color3,
        "4": theme.color4,
        "5": theme.color5,
        "6": theme.color6,
        "7": theme.color7,
        "8": theme.color8,
        "9": theme.color9,
        "10": theme.color10,
        "11": theme.color11,
        "12": theme.color12,
    });

    return (
        <YStack>
            <Form>
                <YStack gap="$2">
                    <Controller
                        control={control}
                        name="calendarId"
                        render={({ field: { onChange, value } }) => (
                            <View>
                                <SelectElement
                                    value={value}
                                    onValueChange={(value) => {
                                        onChange(value);
                                        const calendar =
                                            myCalendars.data?.find(
                                                (calendar) =>
                                                    calendar.id === value,
                                            ) || null;
                                        setSelectedCalendar(calendar);
                                        if (calendar?.color) {
                                            setValue("color", calendar.color);
                                        }
                                    }}
                                    renderValue={(value) => {
                                        const calendar = myCalendars.data?.find(
                                            (calendar) => calendar.id === value,
                                        );

                                        return (
                                            <Text>
                                                {
                                                    <ColorIcon
                                                        color={
                                                            colors.current[
                                                                calendar?.color!
                                                            ].val
                                                        }
                                                    />
                                                }
                                                {calendar?.name}
                                            </Text>
                                        );
                                    }}
                                    defaultValue={""}
                                    triggerPlaceholder=""
                                    groupItems={myCalendars.data?.map(
                                        (calendar, i) => (
                                            <Select.Item
                                                key={i}
                                                index={i}
                                                value={calendar.id!}
                                            >
                                                <Select.ItemText>
                                                    {
                                                        <ColorIcon
                                                            color={
                                                                colors.current[
                                                                    calendar
                                                                        ?.color!
                                                                ].val
                                                            }
                                                        />
                                                    }
                                                    {calendar.name}
                                                </Select.ItemText>
                                            </Select.Item>
                                        ),
                                    )}
                                />
                            </View>
                        )}
                    />
                    <Controller
                        control={control}
                        name="entryCategory"
                        render={({ field: { onChange, value } }) => (
                            <View>
                                <SelectElement
                                    value={value}
                                    onValueChange={(value) => onChange(value)}
                                    renderValue={(value) => (
                                        <Text>{value}</Text>
                                    )}
                                    triggerPlaceholder=""
                                    groupItems={ENTRY_CATEGORIES.map(
                                        (category, i) => (
                                            <Select.Item
                                                key={i}
                                                index={i}
                                                value={category}
                                            >
                                                <Select.ItemText>
                                                    {category}
                                                </Select.ItemText>
                                            </Select.Item>
                                        ),
                                    )}
                                />
                            </View>
                        )}
                    />
                    <Controller
                        control={control}
                        name="name"
                        render={({ field: { onChange, value, ref } }) => (
                            <StyledInput
                                ref={ref}
                                placeholder="Name"
                                onChange={onChange}
                                value={value}
                                returnKeyType="next"
                                autoFocus
                            />
                        )}
                    />
                    {errors.name && <ErrorText message={errors.name.message} />}
                    <Controller
                        control={control}
                        name="description"
                        render={({ field: { onChange, value, ref } }) => (
                            <StyledInput
                                ref={ref}
                                placeholder="Description"
                                onChange={onChange}
                                value={value}
                                returnKeyType="done"
                                onSubmitEditing={handleSubmit(onSubmit)}
                            />
                        )}
                    />
                    {errors.description && (
                        <ErrorText message={errors.description.message} />
                    )}
                    <Controller
                        control={control}
                        name="isAllDay"
                        render={({ field: { onChange, value, ref } }) => (
                            <XStack style={{ alignItems: "center" }} gap="$2">
                                <Checkbox
                                    id="isAllDayCheckbox"
                                    ref={ref}
                                    checked={value}
                                    onCheckedChange={(value) => {
                                        onChange(value);
                                    }}
                                >
                                    <Checkbox.Indicator>
                                        <Check />
                                    </Checkbox.Indicator>
                                </Checkbox>
                                <Label htmlFor="isAllDayCheckbox">
                                    All Day
                                </Label>
                            </XStack>
                        )}
                    />
                    <Controller
                        control={control}
                        name="startDate"
                        render={({ field: { onChange, value } }) => (
                            <DatePicker
                                selected={value}
                                onChange={(value: Date | null) => {
                                    onChange(value);
                                    setValue(
                                        "endDate",
                                        new Date(
                                            value!.getTime() + 60 * 60 * 1000,
                                        ),
                                    );
                                }}
                                locale={
                                    locale instanceof Intl.Locale
                                        ? locale.language
                                        : "en"
                                }
                                timeInputLabel="Time:"
                                dateFormat={
                                    isAllDay
                                        ? "MM/dd/yyyy"
                                        : "MM/dd/yyyy hh:mm aa"
                                }
                                showTimeInput={!isAllDay}
                                className="custom-datepicker"
                                wrapperClassName="custom-datepicker-wrapper"
                            />
                        )}
                    />
                    {!isAllDay && (
                        <Controller
                            control={control}
                            name="endDate"
                            render={({ field: { onChange, value } }) => (
                                <DatePicker
                                    selected={value}
                                    onChange={onChange}
                                    locale={
                                        locale instanceof Intl.Locale
                                            ? locale.language
                                            : "en"
                                    }
                                    timeInputLabel="Time:"
                                    dateFormat="MM/dd/yyyy hh:mm aa"
                                    showTimeInput
                                    className="custom-datepicker"
                                    wrapperClassName="custom-datepicker-wrapper"
                                />
                            )}
                        />
                    )}
                    <XStack style={{ alignItems: "center" }} gap="$2">
                        <Checkbox
                            id="useCalendarColorCheckbox"
                            checked={useCalendarColor}
                            onCheckedChange={(value) => {
                                setUseCalendarColor(
                                    value === "indeterminate" ? false : value,
                                );
                            }}
                        >
                            <Checkbox.Indicator>
                                <Check />
                            </Checkbox.Indicator>
                        </Checkbox>
                        <Label htmlFor="useCalendarColorCheckbox">
                            Use calendar color
                        </Label>
                    </XStack>
                    {!useCalendarColor && (
                        <Controller
                            control={control}
                            name="color"
                            render={({ field: { onChange, value } }) => (
                                <ColorSelect
                                    value={value}
                                    onChange={onChange}
                                />
                            )}
                        />
                    )}
                    <StyledButton
                        onPress={handleSubmit(onSubmit)}
                        disabled={createCalendarEntryMutation.isPending}
                        icon={
                            createCalendarEntryMutation.isPending
                                ? () => <Spinner color="$color12" />
                                : undefined
                        }
                        scaleIcon={1.5}
                        iconAfter={
                            !createCalendarEntryMutation.isPending ? (
                                <CalendarPlus2 />
                            ) : undefined
                        }
                    >
                        {!createCalendarEntryMutation.isPending && (
                            <Text style={{ userSelect: "none" }}>
                                Create Entry
                            </Text>
                        )}
                    </StyledButton>
                    {error && (
                        <Theme name="error">
                            <Text
                                style={{ textAlign: "center" }}
                                color="$color9"
                            >
                                {error}
                            </Text>
                        </Theme>
                    )}
                </YStack>
            </Form>
        </YStack>
    );
}
