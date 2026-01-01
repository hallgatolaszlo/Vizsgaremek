import type { TamaguiBuildOptions } from "tamagui";

export default {
	components: ["tamagui"],
	config: "../../packages/config/src/tamagui.config.ts",
	outputCSS: "./public/tamagui.css",
} satisfies TamaguiBuildOptions;
