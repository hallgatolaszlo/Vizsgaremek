import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from "@react-navigation/native";
import { initializeNativeTokenStorage } from "@repo/api";
import { config } from "@repo/config";
import { useAuthStore } from "@repo/hooks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Text, useColorScheme, View } from "react-native";
import { TamaguiProvider } from "tamagui";

// Initialize native token storage with expo-secure-store
initializeNativeTokenStorage(SecureStore);

export default function RootLayout() {
	const [queryClient] = useState(() => new QueryClient());
	const colorScheme = useColorScheme();

	const verifyAuth = useAuthStore((state) => state.verifyAuth);
	const isAuthorized = useAuthStore((state) => state.isAuthorized);
	const isLoading = useAuthStore((state) => state.isLoading);

	useEffect(() => {
		verifyAuth();
	}, []);

	if (isLoading) {
		return (
			<View>
				<Text>Loading...</Text>
			</View>
		);
	}

	return (
		<QueryClientProvider client={queryClient}>
			<TamaguiProvider config={config}>
				<ThemeProvider
					value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
				>
					<Stack>
						<Stack.Screen
							name="(guest)"
							options={{ headerShown: false }}
						/>
						<Stack.Screen
							name="(protected)"
							options={{ headerShown: false }}
						/>
					</Stack>
					<StatusBar style="auto" />
				</ThemeProvider>
			</TamaguiProvider>
		</QueryClientProvider>
	);
}
