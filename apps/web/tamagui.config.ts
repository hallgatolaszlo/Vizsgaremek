import { defaultConfig } from "@tamagui/config/v4";
import { createTamagui } from "tamagui";

const tamaguiConfig = createTamagui(defaultConfig);

export type Config = typeof tamaguiConfig;

declare module "tamagui" {
	// or '@tamagui/core'
	// overrides TamaguiCustomConfig so your custom types
	// work everywhere you import `tamagui`
	interface TamaguiCustomConfig extends Config {}
}

export default tamaguiConfig;
