import { defaultConfig } from "@tamagui/config/v4";
import { createTamagui } from "tamagui";
import { font } from "./fonts";
import { themes } from "./themes";

export const config = createTamagui({
	...defaultConfig,
	themes,
	fonts: { heading: font, body: font },
});

export type Config = typeof config;

declare module "tamagui" {
	// or '@tamagui/core'
	// overrides TamaguiCustomConfig so your custom types
	// work everywhere you import `tamagui`
	interface TamaguiCustomConfig extends Config {}
}
