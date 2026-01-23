import * as Colors from "@tamagui/colors";
import { createThemes, defaultComponentThemes } from "@tamagui/theme-builder";

const darkPalette = [
	"hsla(222, 14%, 6%, 1)", // 1 Background
	"hsla(222, 14%, 10%, 1)", // 2 Subtle bg
	"hsla(222, 14%, 15%, 1)", // 3 Inactive surface
	"hsla(222, 14%, 21%, 1)", // 4 Default surface
	"hsla(222, 14%, 28%, 1)", // 5 Hover surface
	"hsla(222, 14%, 36%, 1)", // 6 Active surface
	"hsla(222, 14%, 45%, 1)", // 7 Default border
	"hsla(222, 14%, 54%, 1)", // 8 Hover border
	"hsla(222, 14%, 64%, 1)", // 9 Muted fill
	"hsla(222, 14%, 74%, 1)", // 10 Strong fill
	"hsla(222, 18%, 84%, 1)", // 11 Secondary text
	"hsla(222, 22%, 94%, 1)", // 12 Primary text
];

const lightPalette = [
	"hsla(0, 0%, 100%, 1)", // 1 Background
	"hsla(210, 17%, 98%, 1)", // 2 Subtle bg
	"hsla(210, 14%, 95%, 1)", // 3 Inactive surface
	"hsla(210, 12%, 92%, 1)", // 4 Default surface
	"hsla(214, 11%, 89%, 1)", // 5 Hover surface
	"hsla(214, 10%, 85%, 1)", // 6 Active surface
	"hsla(214, 12%, 87%, 1)", // 7 Default border
	"hsla(214, 10%, 75%, 1)", // 8 Hover border
	"hsla(214, 6%, 60%, 1)", // 9 Muted fill
	"hsla(214, 6%, 45%, 1)", // 10 Strong fill
	"hsla(210, 6%, 46%, 1)", // 11 Secondary text
	"hsla(225, 6%, 25%, 1)", // 12 Primary text
];

const lightShadows = {
	shadow1: "rgba(0,0,0,0.02)",
	shadow2: "rgba(0,0,0,0.05)",
	shadow3: "rgba(0,0,0,0.1)",
	shadow4: "rgba(0,0,0,0.15)",
	shadow5: "rgba(0,0,0,0.2)",
	shadow6: "rgba(0,0,0,0.25)",
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
				"hsla(214, 100%, 98%, 1)",
				"hsla(214, 95%, 96%, 1)",
				"hsla(214, 90%, 93%, 1)",
				"hsla(214, 85%, 88%, 1)",
				"hsla(214, 80%, 80%, 1)",
				"hsla(214, 82%, 51%, 1)", // 6 Primary - Google Blue (#1A73E8)
				"hsla(214, 85%, 45%, 1)",
				"hsla(214, 90%, 38%, 1)",
				"hsla(214, 90%, 30%, 1)",
				"hsla(214, 90%, 22%, 1)",
				"hsla(214, 90%, 14%, 1)",
				"hsla(214, 90%, 8%, 1)",
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
