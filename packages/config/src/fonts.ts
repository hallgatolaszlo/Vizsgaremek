import { createFont, isWeb } from "tamagui";

const builtFont = createFont({
	family: isWeb ? "Roboto, Helvetica, Arial, sans-serif" : "System",
	size: {
		1: 12,
		2: 14,
		3: 15,
		4: 16,
	},
	weight: {
		1: "300",
		2: "600",
	},

	// (native only) swaps out fonts by face/style
	face: {
		300: { normal: "InterLight", italic: "InterItalic" },
		600: { normal: "InterBold" },
	},
});

export type Font = typeof builtFont;

export const font: Font =
	process.env.TAMAGUI_ENVIRONMENT === "client" &&
	process.env.NODE_ENV === "production"
		? ({} as any)
		: (builtFont as any);
