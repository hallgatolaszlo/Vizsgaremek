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
	"hsla(222, 20%, 99%, 1)", // 1 Background
	"hsla(222, 20%, 97%, 1)", // 2 Subtle bg
	"hsla(222, 20%, 94%, 1)", // 3 Inactive surface
	"hsla(222, 20%, 91%, 1)", // 4 Default surface
	"hsla(222, 20%, 86%, 1)", // 5 Hover surface
	"hsla(222, 18%, 80%, 1)", // 6 Active surface
	"hsla(222, 16%, 72%, 1)", // 7 Default border
	"hsla(222, 16%, 60%, 1)", // 8 Hover border
	"hsla(222, 16%, 48%, 1)", // 9 Muted fill
	"hsla(222, 16%, 35%, 1)", // 10 Strong fill
	"hsla(222, 18%, 22%, 1)", // 11 Secondary text
	"hsla(222, 20%, 10%, 1)", // 12 Primary text
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
				"hsla(245, 100%, 99%, 1)",
				"hsla(245, 100%, 97%, 1)",
				"hsla(245, 90%, 92%, 1)",
				"hsla(245, 85%, 85%, 1)",
				"hsla(245, 80%, 75%, 1)",
				"hsla(245, 70%, 55%, 1)", // Primary
				"hsla(245, 65%, 48%, 1)",
				"hsla(245, 60%, 40%, 1)",
				"hsla(245, 60%, 30%, 1)",
				"hsla(245, 60%, 20%, 1)",
				"hsla(245, 60%, 12%, 1)",
				"hsla(245, 60%, 7%, 1)",
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
