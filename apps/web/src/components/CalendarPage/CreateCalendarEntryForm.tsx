"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { createCalendarEntry } from "@repo/api";
import {
	useCalendars,
	useCalendarStore,
	useContextMenuStore,
	useProfileStore,
} from "@repo/hooks";
import { components } from "@repo/types";
import {
	ColorIcon,
	SelectElement,
	StyledButton,
	StyledInput,
	StyledTextArea,
} from "@repo/ui";
import { CalendarPlus2, Check, X } from "@tamagui/lucide-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRef, useState } from "react";
import DatePicker from "react-datepicker";
import { Controller, useForm, useWatch } from "react-hook-form";
import {
	Checkbox,
	Form,
	Label,
	Select,
	Separator,
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

export function CreateCalendarEntryForm({
	isContextMenu = true,
	onClose,
}: {
	isContextMenu?: boolean;
	onClose?: () => void;
}) {
	const queryClient = useQueryClient();
	const myCalendars = useCalendars();

	const { selectedDate } = useCalendarStore();
	const { date } = useContextMenuStore();

	const [error, setError] = useState<string | null>(null);
	const [selectedCalendar, setSelectedCalendar] =
		useState<GetCalendarDTO | null>(myCalendars.data?.[0] || null);
	const [useCalendarColor, setUseCalendarColor] = useState(true);

	const initialDate = isContextMenu ? date : selectedDate;
	initialDate?.setHours(new Date().getHours(), 0, 0, 0);
	const { locale } = useProfileStore();

	const [isStartDatePickerOpen, setIsStartDatePickerOpen] = useState(false);
	const [isEndDatePickerOpen, setIsEndDatePickerOpen] = useState(false);

	const {
		control,
		handleSubmit,
		reset,
		setValue,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(createCalendarEntrySchema),
		defaultValues: {
			calendarId: selectedCalendar?.id || "",
			entryCategory: "None" as const,
			name: "",
			description: "",
			isAllDay: true,
			startDate: initialDate ?? new Date(),
			endDate: new Date(
				(initialDate ?? new Date()).getTime() + 60 * 60 * 1000,
			),
			color: selectedCalendar?.color || 1,
		},
	});

	const isAllDay = useWatch({ control, name: "isAllDay" });

	// Mutation for sign-up action
	const createCalendarEntryMutation = useMutation({
		mutationFn: async (request: CreateCalendarEntryDTO) => {
			await createCalendarEntry(request);
			queryClient.invalidateQueries({ queryKey: ["calendarEntries"] });
		},
		onSuccess: () => {
			onClose?.();
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
	type ThemeColor = ReturnType<typeof useTheme>["color1"];

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
	const colors = useRef<Record<string, ThemeColor>>({
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
		<Form style={{ minWidth: 300, width: "fit-content" }}>
			<YStack gap="$4">
				<YStack gap={"$2"} style={{ alignItems: "center" }}>
					<Text color={"$color11"}>Calendar</Text>
					<Separator style={{ borderWidth: 1, width: "100%" }} />
					<Controller
						control={control}
						name="calendarId"
						render={({ field: { onChange, value } }) => (
							<View style={{ width: "100%" }}>
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
											<Select.ItemText>
												<XStack
													gap="$2"
													alignItems="center"
												>
													{calendar &&
													calendar.color ? (
														<ColorIcon
															color={
																colors.current[
																	calendar
																		.color
																]?.val
															}
														/>
													) : null}
													<Text>
														{calendar?.name}
													</Text>
												</XStack>
											</Select.ItemText>
										);
									}}
									valueStyle={{
										display: "flex",
										flexDirection: "row",
										flexWrap: "nowrap",
										gap: 15,
									}}
									defaultValue={""}
									groupItems={myCalendars.data?.map(
										(calendar, i) => (
											<Select.Item
												key={i}
												index={i}
												value={calendar.id!}
											>
												<Select.ItemText
													style={{
														display: "flex",
														alignItems: "center",
														gap: 15,
													}}
												>
													<XStack
														gap="$2"
														alignItems="center"
													>
														{calendar &&
														calendar.color ? (
															<ColorIcon
																color={
																	colors
																		.current[
																		calendar
																			.color
																	]?.val
																}
															/>
														) : null}
														<Text>
															{calendar?.name}
														</Text>
													</XStack>
												</Select.ItemText>
											</Select.Item>
										),
									)}
								/>
							</View>
						)}
					/>
				</YStack>
				<YStack gap={"$2"} style={{ alignItems: "center" }}>
					<Text color={"$color11"}>Entry Type</Text>
					<Separator style={{ borderWidth: 1, width: "100%" }} />
					<Controller
						control={control}
						name="entryCategory"
						render={({ field: { onChange, value } }) => (
							<View style={{ width: "100%" }}>
								<SelectElement
									value={value}
									onValueChange={(value) => onChange(value)}
									renderValue={(value) => (
										<Text>{value}</Text>
									)}
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
				</YStack>
				<YStack gap={"$2"} style={{ alignItems: "center" }}>
					<Text color={"$color11"}>Title & Description</Text>
					<Separator style={{ borderWidth: 1, width: "100%" }} />
					<Controller
						control={control}
						name="name"
						render={({ field: { onChange, value, ref } }) => (
							<StyledInput
								style={{ width: "100%" }}
								ref={ref}
								placeholder="Title"
								onChange={onChange}
								value={value}
								returnKeyType="next"
							/>
						)}
					/>
					{errors.name && <ErrorText message={errors.name.message} />}
					<Controller
						control={control}
						name="description"
						render={({ field: { onChange, value } }) => (
							<StyledTextArea
								style={{ width: "100%" }}
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
				</YStack>
				<YStack gap={"$2"} style={{ textAlign: "center" }}>
					<Text color={"$color11"}>Time</Text>
					<Separator style={{ borderWidth: 1, width: "100%" }} />
					<Controller
						control={control}
						name="isAllDay"
						render={({ field: { onChange, value, ref } }) => (
							<XStack
								style={{
									alignItems: "center",
								}}
								gap="$2"
							>
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
							<View
								style={{
									height: "40px",
									flexGrow: 1,
									flexShrink: 1,
								}}
							>
								<DatePicker
									open={isStartDatePickerOpen}
									onClickOutside={() =>
										setIsStartDatePickerOpen(false)
									}
									onInputClick={() =>
										setIsStartDatePickerOpen(true)
									}
									selected={value ?? new Date()}
									onChange={(val: Date | null) => {
										if (!val) return;
										onChange(val);
										setValue(
											"endDate",
											new Date(
												val.getTime() + 60 * 60 * 1000,
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
							</View>
						)}
					/>
					{!isAllDay && (
						<Controller
							control={control}
							name="endDate"
							render={({ field: { onChange, value } }) => (
								<View
									style={{
										height: "40px",
										flexGrow: 1,
										flexShrink: 1,
									}}
								>
									<DatePicker
										open={isEndDatePickerOpen}
										onClickOutside={() =>
											setIsEndDatePickerOpen(false)
										}
										onInputClick={() =>
											setIsEndDatePickerOpen(true)
										}
										selected={value ?? new Date()}
										onChange={(val: Date | null) => {
											if (!val) return;
											onChange(val);
										}}
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
								</View>
							)}
						/>
					)}
				</YStack>
				<YStack gap={"$2"} style={{ textAlign: "center" }}>
					<Text color={"$color11"}>Color</Text>
					<Separator style={{ borderWidth: 1, width: "100%" }} />
					<XStack
						style={{
							justifyContent: "space-between",
							alignItems: "center",
						}}
					>
						<Controller
							control={control}
							name="color"
							render={({ field: { onChange, value } }) => (
								<ColorSelect
									disabled={useCalendarColor}
									value={value}
									onChange={onChange}
								/>
							)}
						/>
						<XStack style={{ alignItems: "center" }} gap="$2">
							<Checkbox
								id="useCalendarColorCheckbox"
								checked={useCalendarColor}
								onCheckedChange={(value) => {
									setUseCalendarColor(
										value === "indeterminate"
											? false
											: value,
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
					</XStack>
				</YStack>
				<XStack gap={"$2"} style={{ width: "100%" }}>
					<StyledButton
						style={{ flexGrow: 1 }}
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
					<StyledButton
						onPress={() => onClose?.()}
						icon={X}
						scaleIcon={1.5}
					/>
				</XStack>
				{error && (
					<Theme name="error">
						<Text style={{ textAlign: "center" }} color="$color9">
							{error}
						</Text>
					</Theme>
				)}
			</YStack>
		</Form>
	);
}
