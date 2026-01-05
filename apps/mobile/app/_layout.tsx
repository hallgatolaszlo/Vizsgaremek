import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from "@react-navigation/native";
import { config } from "@repo/config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { useColorScheme } from "react-native";
import { TamaguiProvider } from "tamagui";

export default function RootLayout() {
	const [queryClient] = useState(() => new QueryClient());
	const colorScheme = useColorScheme();

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
					</Stack>
					<StatusBar style="auto" />
				</ThemeProvider>
			</TamaguiProvider>
		</QueryClientProvider>
	);
}
