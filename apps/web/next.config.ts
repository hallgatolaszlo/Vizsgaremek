import { withTamagui } from "@tamagui/next-plugin";

module.exports = () => {
	const tamaguiPlugin = withTamagui({
		config: "../../packages/config/src/tamagui.config.ts",
		components: ["tamagui"],
		appDir: true,
		disableExtraction: process.env.NODE_ENV === "development",
	});

	/** @type {import('next').NextConfig} */
	const nextConfig = {
		turbopack: {
			resolveAlias: {
				"react-native-svg": "react-native-svg-web",
			},
		},
	};

	return tamaguiPlugin(nextConfig);
};
