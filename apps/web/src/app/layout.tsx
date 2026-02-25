import type { Metadata } from "next";
import "../../public/tamagui.css";
import { Providers } from "../components/Providers";
import "./globals.css";

export const metadata: Metadata = {
	title: "Planova",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className="antialiased">
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
