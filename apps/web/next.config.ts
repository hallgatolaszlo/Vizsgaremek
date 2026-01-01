const defaultConfig = require("@tamagui/config/v4");
const { withTamagui } = require("@tamagui/next-plugin");
const fs = require("fs");
const path = require("path");

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
