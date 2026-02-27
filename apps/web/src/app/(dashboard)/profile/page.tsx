"use client";
import "react-datepicker/dist/react-datepicker.css";

export default function ProfilePage() {
	return <></>;

	// const { isPending, error, data } = useProfile();
	// // const { locale } = useProfileStore();
	// const queryClient = useQueryClient();

	// const [isEditing, setIsEditing] = useState(false);
	// const [errors, setErrors] = useState<string | null>(null);

	// const [username, setUsername] = useState("");
	// const [firstName, setFirstName] = useState("");
	// const [lastName, setLastName] = useState("");
	// const [birthDate, setBirthDate] = useState<Date | null>(null);
	// // const [email, setEmail] = useState("");
	// const [isPrivate, setIsPrivate] = useState(false);

	// if (isPending) {
	// 	return <Text>Loading...</Text>;
	// }

	// if (error) {
	// 	return <Text>Error: {error.message}</Text>;
	// }

	// function startEditing() {
	// 	setUsername(data?.username || "");
	// 	setFirstName(data?.firstName || "");
	// 	setLastName(data?.lastName || "");
	// 	setBirthDate(data?.birthDate ? new Date(data.birthDate) : null);
	// 	setIsPrivate(data?.isPrivate || false);
	// 	// setEmail(data?.userEmail || "");
	// 	setIsEditing(true);
	// }

	// async function saveProfile() {
	// 	const payload = {
	// 		id: data?.id,
	// 		username: username,
	// 		avatar: data?.avatar || "",
	// 		isPrivate: isPrivate,
	// 		firstName: firstName,
	// 		lastName: lastName,
	// 		birthDate: birthDate ? birthDate.toISOString().split("T")[0] : null,
	// 		// email: email,
	// 	};

	// 	try {
	// 		await updateProfile(payload);
	// 		console.log("Saved:", payload);
	// 		queryClient.invalidateQueries({ queryKey: ["profile"] });
	// 		setErrors(null);
	// 		setIsEditing(false);
	// 	} catch (err) {
	// 		console.error("Failed to update profile:", err);
	// 		if (err instanceof AxiosError) {
	// 			setErrors(err.response?.data || "Failed to update profile");
	// 		} else {
	// 			setErrors("An unknown error occurred");
	// 		}
	// 	}
	// }

	// return (
	// 	<YStack>
	// 		<Text fontWeight="bold" textAlign="center" width="100%">
	// 			My Profile
	// 		</Text>

	// 		<XStack>
	// 			{/* Profile data section */}
	// 			<YStack>
	// 				<Text fontSize="$4" fontWeight="bold">
	// 					Profile information
	// 				</Text>

	// 				<XStack alignItems="center" gap="$2">
	// 					<Text>Username: </Text>
	// 					{isEditing ? (
	// 						<Input
	// 							value={username}
	// 							onChangeText={setUsername}
	// 							placeholder="Enter username"
	// 						/>
	// 					) : (
	// 						<Text>{data?.username}</Text>
	// 					)}
	// 				</XStack>

	// 				{/* <XStack alignItems="center" gap="$2">
	// 					<Text>Email Address: </Text>
	// 					{isEditing ? (
	// 						<Input
	// 							value={email}
	// 							onChangeText={setEmail}
	// 							placeholder="Enter email address"
	// 						/>
	// 					) : (
	// 						<Text>{data?.userEmail}</Text>
	// 					)}
	// 				</XStack> */}

	// 				<XStack alignItems="center" gap="$2">
	// 					<Text>Birth Date: </Text>
	// 					{isEditing ? (
	// 						<DatePicker
	// 							wrapperClassName="custom-datepicker-wrapper"
	// 							className="custom-datepicker"
	// 							selected={birthDate}
	// 							onChange={(date: Date | null) =>
	// 								setBirthDate(date)
	// 							}
	// 							dateFormat="yyyy-MM-dd"
	// 							placeholderText="Select your birth date"
	// 						/>
	// 					) : (
	// 						<Text>{data?.birthDate}</Text>
	// 					)}
	// 				</XStack>

	// 				{/* <Text>
	// 					Account Created At:{" "}
	// 					{data?.userCreatedAt
	// 						? new Intl.DateTimeFormat(locale, {
	// 								year: "numeric",
	// 								month: "2-digit",
	// 								day: "2-digit",
	// 							}).format(new Date(data.userCreatedAt))
	// 						: ""}
	// 				</Text> */}

	// 				<XStack alignItems="center" gap="$2">
	// 					<Text>Private: </Text>
	// 					{isEditing ? (
	// 						<Checkbox
	// 							checked={isPrivate}
	// 							onCheckedChange={(checked) =>
	// 								setIsPrivate(checked as boolean)
	// 							}
	// 						>
	// 							{}
	// 						</Checkbox>
	// 					) : (
	// 						<Text>{data?.isPrivate ? "Yes" : "No"}</Text>
	// 					)}
	// 				</XStack>

	// 				<XStack alignItems="center" gap="$2">
	// 					<Text>First Name: </Text>
	// 					{isEditing ? (
	// 						<Input
	// 							value={firstName}
	// 							onChangeText={setFirstName}
	// 							placeholder="Enter first name"
	// 						/>
	// 					) : (
	// 						<Text>{data?.firstName}</Text>
	// 					)}
	// 				</XStack>

	// 				<XStack alignItems="center" gap="$2">
	// 					<Text>Last Name: </Text>
	// 					{isEditing ? (
	// 						<Input
	// 							value={lastName}
	// 							onChangeText={setLastName}
	// 							placeholder="Enter last name"
	// 						/>
	// 					) : (
	// 						<Text>{data?.lastName}</Text>
	// 					)}
	// 				</XStack>
	// 			</YStack>

	// 			<YStack>
	// 				{isEditing ? (
	// 					<>
	// 						{errors && <Text color="red">{errors}</Text>}
	// 						<Button onPress={saveProfile}>
	// 							<Save size={16} />
	// 							Save Profile
	// 						</Button>
	// 					</>
	// 				) : (
	// 					<Button onPress={startEditing}>
	// 						<Pencil size={16} />
	// 						Edit Profile
	// 					</Button>
	// 				)}
	// 			</YStack>
	// 		</XStack>
	// 	</YStack>
	// );
}
