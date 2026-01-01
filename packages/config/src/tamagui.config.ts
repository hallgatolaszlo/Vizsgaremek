import { defaultConfig } from "@tamagui/config/v4";
import { createTamagui } from "tamagui";
import { themes } from "./themes";

export const config = createTamagui({ ...defaultConfig, themes });

export type Config = typeof config;

declare module "tamagui" {
	// or '@tamagui/core'
	// overrides TamaguiCustomConfig so your custom types
	// work everywhere you import `tamagui`
	interface TamaguiCustomConfig extends Config {}
}
