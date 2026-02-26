import { zodResolver } from "@hookform/resolvers/zod";
import { deleteCalendarEntry, updateCalendarEntry } from "@repo/api";
import { useCalendars, useProfileStore } from "@repo/hooks";
import { components } from "@repo/types";
import { ColorIcon, SelectElement, StyledButton, StyledInput } from "@repo/ui";
import {
	Calendar,
	CalendarPlus2,
	Check,
	Pencil,
	RectangleEllipsis,
	Trash2,
	User,
	X,
} from "@tamagui/lucide-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import * as locales from "date-fns/locale";
import { useMemo, useRef, useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Controller, useForm } from "react-hook-form";
import {
	Checkbox,
	Form,
	Label,
	Select,
	Spinner,
	Text,
	Theme,
	View,
	XStack,
	YStack,
	useTheme,
} from "tamagui";
import z from "zod";
import ColorSelect from "./ColorSelect";

type GetCalendarEntryDTO = components["schemas"]["GetCalendarEntryDTO"];
type UpdateCalendarEntryDTO = components["schemas"]["UpdateCalendarEntryDTO"];
type CalendarEntryCategory = components["schemas"]["EntryCategory"];

interface CalendarEntryProps {
	entry: GetCalendarEntryDTO;
	onClose?: () => void;
}

const ENTRY_CATEGORIES: CalendarEntryCategory[] = [
	"None",
	"Task",
	"Event",
	"BirthDay",
	"Anniversary",
];

// Zod schema for sign-up form validation
const updateCalendarEntrySchema = z.object({
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

export default function CalendarEntryDetail({
	entry,
	onClose,
}: CalendarEntryProps) {
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
	const entryColor = theme[`color${entry.color}`]?.val;
	const { locale, hour12 } = useProfileStore();
	const [isUnderModify, setIsUnderModify] = useState<boolean>();
	const {
		handleSubmit,
		control,
		setValue,
		watch,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(updateCalendarEntrySchema),
		defaultValues: {
			name: entry.name!,
			color: entry.color,
			isAllDay: entry.isAllDay ?? undefined,
			startDate: new Date(entry.startDate!) ?? undefined,
			endDate: entry.endDate ? new Date(entry.endDate) : undefined,
			entryCategory: entry.entryCategory,
			calendarId: entry.calendarId,
			description: entry.description ?? undefined,
		},
	});
	const myCalendars = useCalendars();
	const [error, setError] = useState<string | null>(null);
	const [useCalendarColor, setUseCalendarColor] = useState(true);

	const isAllDay = watch("isAllDay");

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString(locale, {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	const formatTime = (dateString: string) => {
		return new Date(dateString).toLocaleTimeString(locale, {
			hour: "numeric",
			minute: "2-digit",
			hour12,
		});
	};

	// Convert Intl.Locale to date-fns locale code and register
	useMemo(() => {
		if (locale instanceof Intl.Locale) {
			const localeCode = locale.language;
			const dateLocale = locales[localeCode as keyof typeof locales];
			if (dateLocale) {
				registerLocale(localeCode, dateLocale);
			}
		}
	}, [locale]);

	const queryClient = useQueryClient();

	async function delCalendarEntry(id: string) {
		await deleteCalendarEntry(id);
		queryClient.invalidateQueries({ queryKey: ["calendarEntries"] });
	}

	const updateCalendarEntryMutation = useMutation({
		mutationFn: async (request: UpdateCalendarEntryDTO) => {
			await updateCalendarEntry(request);
			queryClient.invalidateQueries({ queryKey: ["calendarEntries"] });
		},
		onSuccess: () => {
			setIsUnderModify(false);
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

	type FormData = z.infer<typeof updateCalendarEntrySchema>;

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
		const id = entry.id;

		const request: UpdateCalendarEntryDTO = {
			...data,
			id: id,
			color: useCalendarColor ? null : data.color,
			startDate: startDate?.toISOString(),
			endDate: endDate?.toISOString(),
		};
		updateCalendarEntryMutation.mutate(request);
	}

	return (
		<YStack width="80vw" maxW={500} overflow="visible">
			<XStack
				style={{
					justifyContent: "flex-end",
					gap: "15px",
					marginBottom: "20px",
				}}
			>
				<XStack
					cursor="pointer"
					onPress={() => {
						delCalendarEntry(entry.id!);
					}}
				>
					<Trash2 width={20} />
				</XStack>

				<XStack
					cursor="pointer"
					onPress={() => {
						setIsUnderModify(!isUnderModify);
					}}
				>
					<Pencil width={20} />
				</XStack>
				<XStack
					ml={10}
					cursor="pointer"
					onPress={(e) => {
						e.stopPropagation();
						onClose?.();
					}}
				>
					<X />
				</XStack>
			</XStack>
			{isUnderModify ? (
				<Form>
					<YStack>
						<XStack>
							{!useCalendarColor && (
								<Controller
									control={control}
									name="color"
									render={({
										field: { onChange, value },
									}) => (
										<ColorSelect
											value={value!}
											onChange={onChange}
										/>
									)}
								/>
							)}
							<Controller
								control={control}
								name="name"
								render={({
									field: { onChange, onBlur, value, ref },
								}) => (
									<StyledInput
										ref={ref}
										placeholder="Enter name"
										onBlur={onBlur}
										onChange={onChange}
										value={value!}
										returnKeyType="next"
										autoFocus
										style={{ width: "100%" }}
									/>
								)}
							/>
						</XStack>
						{errors.name && (
							<ErrorText message={errors.name.message} />
						)}
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

						<Controller
							control={control}
							name="description"
							render={({ field: { onChange, value, ref } }) => (
								<StyledInput
									ref={ref}
									placeholder="Description..."
									onChange={onChange}
									value={value!}
									returnKeyType="done"
								/>
							)}
						/>
						{errors.description && (
							<ErrorText message={errors.description.message} />
						)}
						<XStack>
							<YStack width={"33%"}>
								<Controller
									control={control}
									name="entryCategory"
									render={({
										field: { onChange, value },
									}) => (
										<View>
											<Label>Category</Label>
											<SelectElement
												value={value}
												onValueChange={(value) =>
													onChange(value)
												}
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
							<YStack width={"66%"}>
								<Controller
									control={control}
									name="calendarId"
									render={({
										field: { onChange, value },
									}) => (
										<View>
											<Label>Calendar</Label>
											<SelectElement
												value={value}
												onValueChange={(value) => {
													onChange(value);
													const calendar =
														myCalendars.data?.find(
															(calendar) =>
																calendar.id ===
																value,
														) || null;
													if (calendar?.color) {
														setValue(
															"color",
															calendar.color,
														);
													}
												}}
												renderValue={(value) => {
													const calendar =
														myCalendars.data?.find(
															(calendar) =>
																calendar.id ===
																value,
														);

													return (
														<XStack gap="$2">
															{
																<ColorIcon
																	color={
																		colors
																			.current[
																			calendar
																				?.color!
																		].val
																	}
																/>
															}
															<Text>
																{calendar?.name}
															</Text>
														</XStack>
													);
												}}
												defaultValue={""}
												groupItems={myCalendars.data?.map(
													(calendar, i) => (
														<Select.Item
															key={i}
															index={i}
															value={calendar.id!}
														>
															<Select.ItemText>
																<XStack gap="$2">
																	{
																		<ColorIcon
																			color={
																				colors
																					.current[
																					calendar
																						?.color!
																				]
																					.val
																			}
																		/>
																	}
																	<Text>
																		{
																			calendar.name
																		}
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
						</XStack>

						<Controller
							control={control}
							name="isAllDay"
							render={({ field: { onChange, value, ref } }) => (
								<XStack
									style={{ alignItems: "center" }}
									gap="$2"
								>
									<Checkbox
										id="isAllDayCheckbox"
										ref={ref}
										checked={value!}
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
						<XStack>
							<Controller
								control={control}
								name="startDate"
								render={({ field: { onChange, value } }) => (
									<div
										style={{
											flexGrow: 1,
											flexShrink: 1,
										}}
									>
										<DatePicker
											selected={new Date(value!)}
											onChange={(value: Date | null) => {
												onChange(value);
												setValue(
													"endDate",
													new Date(
														value!.getTime() +
															60 * 60 * 1000,
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
									</div>
								)}
							/>
							{!isAllDay && (
								<Controller
									control={control}
									name="endDate"
									render={({
										field: { onChange, value },
									}) => (
										<div
											style={{
												flexGrow: 1,
												flexShrink: 1,
											}}
										>
											<DatePicker
												selected={new Date(value!)}
												onChange={onChange}
												locale={
													locale instanceof
													Intl.Locale
														? locale.language
														: "en"
												}
												timeInputLabel="Time:"
												dateFormat="MM/dd/yyyy hh:mm aa"
												showTimeInput
												className="custom-datepicker"
												wrapperClassName="custom-datepicker-wrapper"
											/>
										</div>
									)}
								/>
							)}
						</XStack>
					</YStack>
					<StyledButton
						mt={5}
						onPress={handleSubmit(onSubmit)}
						disabled={updateCalendarEntryMutation.isPending}
						icon={
							updateCalendarEntryMutation.isPending
								? () => <Spinner color="$color12" />
								: undefined
						}
						scaleIcon={1.5}
						iconAfter={
							!updateCalendarEntryMutation.isPending ? (
								<CalendarPlus2 />
							) : undefined
						}
					>
						{!updateCalendarEntryMutation.isPending && (
							<Text style={{ userSelect: "none" }}>
								Update Entry
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
				</Form>
			) : (
				<YStack>
					<XStack style={{ alignItems: "center", gap: "1rem" }}>
						<ColorIcon color={entryColor} />
						<YStack style={{ alignItems: "flex-start" }}>
							<Text
								style={{
									fontWeight: "bold",
									fontSize: "1.5em",
									textTransform: "capitalize",
								}}
							>
								{entry.name}
							</Text>
							<Text>
								{entry.isAllDay
									? formatDate(entry.startDate!)
									: `${formatDate(entry.startDate!)} ${formatTime(entry.startDate!)} - ${formatDate(entry.endDate!)} ${formatTime(entry.endDate!)}`}
							</Text>
						</YStack>
					</XStack>
					{entry.entryCategory != "None" && (
						<Text mb={5}>{entry.entryCategory}</Text>
					)}
					{!!entry.description && (
						<XStack m={5} mt={10}>
							<RectangleEllipsis />
							<Text m={5}>{entry.description}</Text>
						</XStack>
					)}
					<XStack m={5} mt={10}>
						<Calendar />
						<Text m={5}>Calendar: {entry.calendarName}</Text>
					</XStack>
				</YStack>
			)}
			<XStack m={5}>
				<User />
				<Text m={5}>Created by: {entry.createdByName}</Text>
			</XStack>
		</YStack>
	);
}
