import { withTamagui } from "@tamagui/next-plugin";
import fs from "fs";
import path from "path";

// Auto-detect all @repo/* packages
const packagesDir = path.resolve("../../packages");
const repoPackages = fs.readdirSync(packagesDir).map((pkg) => `@repo/${pkg}`);

const tamaguiPlugin = withTamagui({
	config: "./tamagui.config.ts",
	components: ["tamagui"],
	appDir: true,
	outputCSS:
		process.env.NODE_ENV === "production" ? "./public/tamagui.css" : null,
	disableExtraction: process.env.NODE_ENV === "development",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	transpilePackages: repoPackages,
};

export default tamaguiPlugin(nextConfig);
