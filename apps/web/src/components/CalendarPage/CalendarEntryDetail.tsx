import { zodResolver } from "@hookform/resolvers/zod";
import { deleteCalendarEntry, updateCalendarEntry } from "@repo/api";
import { useCalendars, useProfileStore } from "@repo/hooks";
import { components } from "@repo/types";
import {
	ColorIcon,
	SelectElement,
	StyledButton,
	StyledInput,
	StyledTextArea,
} from "@repo/ui";
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
import { Controller, useForm, useWatch } from "react-hook-form";
import {
	Checkbox,
	Form,
	H1,
	Label,
	Select,
	Separator,
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
	const colors = useRef<Record<string, typeof theme.color1>>({
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
	const startPlusOneHour = new Date(entry.startDate!);
	startPlusOneHour.setHours(startPlusOneHour.getHours() + 1);
	const endDate = entry.isAllDay
		? startPlusOneHour
		: new Date(entry.endDate!);
	const {
		handleSubmit,
		control,
		setValue,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(updateCalendarEntrySchema),
		defaultValues: {
			name: entry.name!,
			color: entry.color,
			isAllDay: entry.isAllDay ?? undefined,
			startDate: new Date(entry.startDate!) ?? undefined,
			endDate: endDate,
			entryCategory: entry.entryCategory,
			calendarId: entry.calendarId,
			description: entry.description ?? undefined,
		},
	});
	const myCalendars = useCalendars();
	const [error, setError] = useState<string | null>(null);
	const [useCalendarColor, setUseCalendarColor] = useState(true);
	const [isEditingTitle, setIsEditingTitle] = useState(false);
	const [isEditingDescription, setIsEditingDescription] = useState(false);
	const [editedTitle, setEditedTitle] = useState(entry.name);
	const [editedDescription, setEditedDescription] = useState(
		entry.description ?? "",
	);

	const isAllDay = useWatch({ control, name: "isAllDay" });

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
		<YStack
			width={isUnderModify ? "fit-content" : "80vw"}
			maxW={500}
			overflow="visible"
		>
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
						const next = !isUnderModify;
						setIsUnderModify(next);
						setIsEditingDescription(false);
						setIsEditingTitle(false);
						if (next) {
							setValue("name", editedTitle!);
							setValue("description", editedDescription);
						}
					}}
				>
					<Pencil width={20} />
				</XStack>
				<XStack
					cursor="pointer"
					onPress={() => {
						delCalendarEntry(entry.id!);
					}}
				>
					<Trash2 width={20} />
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
				<Form style={{ minWidth: 300, width: "fit-content" }}>
					<YStack gap="$4">
						<YStack gap={"$2"} style={{ alignItems: "center" }}>
							<Text color={"$color11"}>Calendar</Text>
							<Separator
								style={{ borderWidth: 1, width: "100%" }}
							/>
							<Controller
								control={control}
								name="calendarId"
								render={({ field: { onChange, value } }) => (
									<View style={{ width: "100%" }}>
										<SelectElement
											value={value}
											valueStyle={{
												display: "flex",
												flexDirection: "row",
												flexWrap: "nowrap",
												gap: 15,
											}}
											onValueChange={(val) => {
												onChange(val);
												const calendar =
													myCalendars.data?.find(
														(c) => c.id === val,
													) || null;
												if (calendar?.color) {
													setValue(
														"color",
														calendar.color,
													);
												}
											}}
											renderValue={(val) => {
												const calendar =
													myCalendars.data?.find(
														(c) => c.id === val,
													);
												return (
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
																			]
																				?.val
																		}
																	/>
																) : null}
																<Text>
																	{
																		calendar?.name
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

						<YStack gap={"$2"} style={{ alignItems: "center" }}>
							<Text color={"$color11"}>Entry Type</Text>
							<Separator
								style={{ borderWidth: 1, width: "100%" }}
							/>
							<Controller
								control={control}
								name="entryCategory"
								render={({ field: { onChange, value } }) => (
									<View style={{ width: "100%" }}>
										<SelectElement
											value={value}
											onValueChange={(v) => onChange(v)}
											renderValue={(v) => (
												<Text>{v}</Text>
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
							<Separator
								style={{ borderWidth: 1, width: "100%" }}
							/>
							<Controller
								control={control}
								name="name"
								render={({
									field: { onChange, value, ref },
								}) => (
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
							{errors.name && (
								<ErrorText message={errors.name.message} />
							)}
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
									/>
								)}
							/>
							{errors.description && (
								<ErrorText
									message={errors.description.message}
								/>
							)}
						</YStack>

						<YStack gap={"$2"} style={{ textAlign: "center" }}>
							<Text color={"$color11"}>Time</Text>
							<Separator
								style={{ borderWidth: 1, width: "100%" }}
							/>
							<Controller
								control={control}
								name="isAllDay"
								render={({
									field: { onChange, value, ref },
								}) => (
									<XStack
										style={{ alignItems: "center" }}
										gap="$2"
									>
										<Checkbox
											id="isAllDayCheckbox"
											ref={ref}
											checked={value!}
											onCheckedChange={(v) => onChange(v)}
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
											selected={value ?? new Date()}
											onChange={(val: Date | null) => {
												if (!val) return;
												onChange(val);
												setValue(
													"endDate",
													new Date(
														val.getTime() +
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
									</View>
								)}
							/>

							{!isAllDay && (
								<Controller
									control={control}
									name="endDate"
									render={({
										field: { onChange, value },
									}) => (
										<View
											style={{
												height: "40px",
												flexGrow: 1,
												flexShrink: 1,
											}}
										>
											<DatePicker
												selected={value ?? new Date()}
												onChange={(
													val: Date | null,
												) => {
													if (val) onChange(val);
												}}
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
										</View>
									)}
								/>
							)}
						</YStack>

						<YStack gap={"$2"} style={{ textAlign: "center" }}>
							<Text color={"$color11"}>Color</Text>
							<Separator
								style={{ borderWidth: 1, width: "100%" }}
							/>
							<XStack
								style={{
									justifyContent: "space-between",
									alignItems: "center",
								}}
							>
								<Controller
									control={control}
									name="color"
									render={({
										field: { onChange, value },
									}) => (
										<ColorSelect
											disabled={useCalendarColor}
											value={value}
											onChange={onChange}
										/>
									)}
								/>

								<XStack
									style={{ alignItems: "center" }}
									gap="$2"
								>
									<Checkbox
										id="useCalendarColorCheckbox"
										checked={useCalendarColor}
										onCheckedChange={(value) =>
											setUseCalendarColor(
												value === "indeterminate"
													? false
													: value,
											)
										}
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

							<StyledButton
								onPress={() => setIsUnderModify(false)}
								icon={X}
								scaleIcon={1.5}
							/>
						</XStack>

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
			) : (
				<YStack gap={10}>
					<XStack gap={"$3"} alignItems="center">
						<ColorIcon color={entryColor} />
						{isEditingTitle ? (
							<XStack flexGrow={1} gap={10}>
								<StyledInput
									value={editedTitle!}
									onChangeText={(text) =>
										setEditedTitle(text)
									}
									flexGrow={1}
								/>
								<XStack gap={10} justifyContent="flex-end">
									<StyledButton
										onPress={() => {
											setIsEditingTitle(false);
											onSubmit({
												name: editedTitle!,
												calendarId: entry.calendarId!,
												entryCategory:
													entry.entryCategory!,
												isAllDay: entry.isAllDay!,
												startDate: new Date(
													entry.startDate!,
												),
												endDate: entry.endDate
													? new Date(entry.endDate)
													: undefined,
												color: entry.color,
												description:
													entry.description ??
													undefined,
											} as FormData);
										}}
									>
										Save
									</StyledButton>
									<StyledButton
										onPress={() => setIsEditingTitle(false)}
									>
										Cancel
									</StyledButton>
								</XStack>
							</XStack>
						) : (
							<View
								onPress={() => setIsEditingTitle(true)}
								hoverStyle={{
									backgroundColor: "$color4",
									cursor: "pointer",
								}}
								style={{
									borderRadius: 5,
								}}
								p={10}
								flexShrink={1}
							>
								<H1 numberOfLines={1} ellipsizeMode="tail">
									{entry.name}
								</H1>
							</View>
						)}
					</XStack>
					<YStack maxWidth="100%" gap={"$2"}>
						<Text
							numberOfLines={1}
							ellipsizeMode="tail"
							flexShrink={1}
						>
							{entry.isAllDay
								? formatDate(entry.startDate!)
								: `${formatDate(entry.startDate!)} ${formatTime(entry.startDate!)} - ${formatDate(entry.endDate!)} ${formatTime(entry.endDate!)}`}
						</Text>
						{entry.entryCategory != "None" && (
							<Text>{entry.entryCategory}</Text>
						)}
					</YStack>

					{!!entry.description && (
						<XStack gap={10} alignItems="center">
							<View>
								<RectangleEllipsis flexGrow={1} />
							</View>
							{isEditingDescription ? (
								<YStack flexGrow={1} gap={10}>
									<StyledTextArea
										value={editedDescription}
										onChangeText={(text) =>
											setEditedDescription(text)
										}
									/>
									<XStack gap={10} justifyContent="flex-end">
										<StyledButton
											onPress={() => {
												setIsEditingDescription(false);
												onSubmit({
													description:
														editedDescription,
													calendarId:
														entry.calendarId!,
													entryCategory:
														entry.entryCategory!,
													isAllDay: entry.isAllDay!,
													startDate: new Date(
														entry.startDate!,
													),
													endDate: entry.endDate
														? new Date(
																entry.endDate,
															)
														: undefined,
													color: entry.color,
													name: entry.name!,
												} as FormData);
											}}
										>
											Save
										</StyledButton>
										<StyledButton
											onPress={() =>
												setIsEditingDescription(false)
											}
										>
											Cancel
										</StyledButton>
									</XStack>
								</YStack>
							) : (
								<View
									onPress={() =>
										setIsEditingDescription(true)
									}
									hoverStyle={{
										backgroundColor: "$color4",
										cursor: "pointer",
									}}
									style={{
										borderRadius: 5,
									}}
									p={10}
									flexShrink={1}
								>
									<Text
										numberOfLines={3}
										ellipsizeMode="tail"
									>
										{entry.description}
									</Text>
								</View>
							)}
						</XStack>
					)}
					<XStack gap={10} alignItems="center">
						<Calendar />
						<Text
							numberOfLines={1}
							ellipsizeMode="tail"
							flexShrink={1}
						>
							{entry.calendarName}
						</Text>
					</XStack>
					<XStack gap={10} alignItems="center">
						<User />
						<Text
							numberOfLines={1}
							ellipsizeMode="tail"
							flexShrink={1}
						>
							{entry.createdByName}
						</Text>
					</XStack>
				</YStack>
			)}
		</YStack>
	);
}
