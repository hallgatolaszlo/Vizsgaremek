import * as Colors from "@tamagui/colors";
import { createThemes, defaultComponentThemes } from "@tamagui/theme-builder";

// Slate-szerű sötét paletta (12 lépcsős)
const darkPalette = [
	"hsla(222, 15%, 5%, 1)", // 1: Background
	"hsla(222, 15%, 8%, 1)", // 2: Subtle Background
	"hsla(222, 15%, 12%, 1)", // 3: UI element background
	"hsla(222, 15%, 16%, 1)", // 4: Hovered UI element
	"hsla(222, 15%, 20%, 1)", // 5: Active UI element
	"hsla(222, 15%, 26%, 1)", // 6: Subtle border
	"hsla(222, 15%, 32%, 1)", // 7: Stronger border
	"hsla(222, 15%, 40%, 1)", // 8: Hover border
	"hsla(222, 15%, 55%, 1)", // 9: Solid background
	"hsla(222, 15%, 65%, 1)", // 10: Hover solid
	"hsla(222, 15%, 85%, 1)", // 11: Low-contrast text
	"hsla(222, 15%, 96%, 1)", // 12: High-contrast text
];

// Slate-szerű világos paletta (12 lépcsős)
const lightPalette = [
	"hsla(222, 20%, 99%, 1)", // 1: Background
	"hsla(222, 20%, 97%, 1)", // 2: Subtle Background
	"hsla(222, 20%, 94%, 1)", // 3: UI element
	"hsla(222, 20%, 90%, 1)", // 4: Hover
	"hsla(222, 20%, 86%, 1)", // 5: Active
	"hsla(222, 15%, 80%, 1)", // 6: Border
	"hsla(222, 15%, 70%, 1)", // 7: Stronger border
	"hsla(222, 15%, 55%, 1)", // 8: Hover border
	"hsla(222, 15%, 45%, 1)", // 9: Solid background
	"hsla(222, 15%, 35%, 1)", // 10: Hover solid
	"hsla(222, 15%, 20%, 1)", // 11: Low-contrast text
	"hsla(222, 15%, 4%, 1)", // 12: High-contrast text
];

const lightShadows = {
	shadow1: "rgba(0,0,0,0.03)",
	shadow2: "rgba(0,0,0,0.06)",
	shadow3: "rgba(0,0,0,0.12)",
	shadow4: "rgba(0,0,0,0.18)",
	shadow5: "rgba(0,0,0,0.24)",
	shadow6: "rgba(0,0,0,0.3)",
};

const darkShadows = {
	shadow1: "rgba(0,0,0,0.3)",
	shadow2: "rgba(0,0,0,0.4)",
	shadow3: "rgba(0,0,0,0.5)",
	shadow4: "rgba(0,0,0,0.6)",
	shadow5: "rgba(0,0,0,0.7)",
	shadow6: "rgba(0,0,0,0.8)",
};

const builtThemes = createThemes({
	componentThemes: defaultComponentThemes,

	base: {
		palette: {
			dark: darkPalette,
			light: lightPalette,
		},

		extra: {
			light: {
				...Colors.blue,
				...Colors.green,
				...Colors.red,
				...Colors.amber,
				...lightShadows,
				shadowColor: lightShadows.shadow1,
			},
			dark: {
				...Colors.blueDark,
				...Colors.greenDark,
				...Colors.redDark,
				...Colors.amberDark,
				...darkShadows,
				shadowColor: darkShadows.shadow1,
			},
		},
	},

	accent: {
		palette: {
			dark: [
				"hsla(245, 60%, 10%, 1)",
				"hsla(245, 60%, 15%, 1)",
				"hsla(245, 60%, 20%, 1)",
				"hsla(245, 60%, 30%, 1)",
				"hsla(245, 60%, 40%, 1)",
				"hsla(245, 70%, 50%, 1)", // Primary
				"hsla(245, 75%, 55%, 1)",
				"hsla(245, 80%, 60%, 1)",
				"hsla(245, 85%, 70%, 1)",
				"hsla(245, 90%, 80%, 1)",
				"hsla(245, 100%, 95%, 1)",
				"hsla(245, 100%, 98%, 1)",
			],
			light: [
				"hsla(245, 100%, 98%, 1)",
				"hsla(245, 100%, 95%, 1)",
				"hsla(245, 90%, 85%, 1)",
				"hsla(245, 85%, 75%, 1)",
				"hsla(245, 80%, 65%, 1)",
				"hsla(245, 70%, 55%, 1)", // Primary
				"hsla(245, 65%, 45%, 1)",
				"hsla(245, 60%, 35%, 1)",
				"hsla(245, 60%, 25%, 1)",
				"hsla(245, 60%, 15%, 1)",
				"hsla(245, 60%, 10%, 1)",
				"hsla(245, 60%, 5%, 1)",
			],
		},
	},

	childrenThemes: {
		warning: {
			palette: {
				dark: Object.values(Colors.amberDark),
				light: Object.values(Colors.amber),
			},
		},

		error: {
			palette: {
				dark: Object.values(Colors.redDark),
				light: Object.values(Colors.red),
			},
		},

		success: {
			palette: {
				dark: Object.values(Colors.greenDark),
				light: Object.values(Colors.green),
			},
		},

		info: {
			palette: {
				dark: Object.values(Colors.blueDark),
				light: Object.values(Colors.blue),
			},
		},
	},
});

export type Themes = typeof builtThemes;

export const themes: Themes =
	process.env.TAMAGUI_ENVIRONMENT === "client" &&
	process.env.NODE_ENV === "production"
		? ({} as any)
		: (builtThemes as any);
