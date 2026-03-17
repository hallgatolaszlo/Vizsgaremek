"use client";

import { useCalendars, useFriends, useProfile } from "@repo/hooks";
import { Pencil } from "@tamagui/lucide-icons";
import { useRouter } from "next/navigation";
import { Avatar, Button, Text, View, XStack, YStack, useTheme } from "tamagui";

export default function ProfilePage() {
    const { isPending, error, data } = useProfile();
    const { data: friendsData } = useFriends();
    const { data: calendars } = useCalendars();
    const router = useRouter();
    const calendarTheme = useTheme({ name: "calendarColors" });

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

    const avatarSrc =
        data?.avatar && data.avatar !== "placeholder"
            ? data.avatar
            : data?.username
              ? `https://ui-avatars.com/api/?name=${encodeURIComponent(data.username)}`
              : undefined;

    const acceptedFriendsCount =
        friendsData?.filter((f) => f.status === "Accepted").length ?? 0;

    return (
        <YStack
            gap="$5"
            p="$6"
            width="100%"
            alignItems="center"
            minHeight="calc(100vh - var(--navbar-height))"
        >
            <Avatar circular size="$20">
                <Avatar.Image src={avatarSrc} alt="Profile Avatar" />
                <Avatar.Fallback backgroundColor="$gray5" />
            </Avatar>

            <XStack gap="$4" alignItems="center">
                <Text fontSize="$7" fontWeight="bold">
                    {data?.username}
                </Text>
                <Text fontSize="$4" color="$color10">
                    Friends: {acceptedFriendsCount}
                </Text>
            </XStack>

            {calendars && calendars.length > 0 && (
                <YStack
                    width="100%"
                    maxWidth={920}
                    gap="$3"
                    padding="$4"
                    alignItems="center"
                    borderRadius="$7"
                    backgroundColor="$color2"
                    borderWidth={1}
                    borderColor="$color6"
                >
                    <XStack
                        width="100%"
                        justifyContent="center"
                        alignItems="center"
                        gap="$2"
                        flexWrap="wrap"
                    >
                        <Text fontSize="$5" fontWeight="bold">
                            My Calendars
                        </Text>
                        <Text color="$color10">
                            {calendars.length} calendars
                        </Text>
                    </XStack>

                    <XStack
                        width="100%"
                        gap="$3"
                        alignItems="center"
                        flexWrap="wrap"
                        justifyContent="center"
                    >
                        {calendars.map((cal) => {
                            const colorKey =
                                `color${cal.color}` as keyof typeof calendarTheme;
                            const chipColor =
                                calendarTheme[colorKey]?.val ?? "#888";
                            return (
                                <XStack
                                    key={cal.id}
                                    alignItems="center"
                                    justifyContent="center"
                                    alignContent="center"
                                    gap="$2"
                                    minWidth={180}
                                    maxWidth={240}
                                    paddingHorizontal="$4"
                                    paddingVertical="$3"
                                    borderRadius="$6"
                                    backgroundColor="$color3"
                                    borderWidth={1}
                                    borderColor={chipColor}
                                >
                                    <View
                                        width={12}
                                        height={12}
                                        borderRadius={6}
                                        backgroundColor={chipColor}
                                        flexShrink={0}
                                    />
                                    <Text
                                        fontSize="$4"
                                        fontWeight="600"
                                        textAlign="center"
                                        numberOfLines={2}
                                    >
                                        {cal.name}
                                    </Text>
                                </XStack>
                            );
                        })}
                    </XStack>
                </YStack>
            )}

            <Button
                size="$5"
                icon={Pencil}
                onPress={() => router.push("/profile/edit")}
            >
                Edit Profile
            </Button>
        </YStack>
    );
}
