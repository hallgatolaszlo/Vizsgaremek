const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
	testEnvironment: "node",
	transform: {
		...tsJestTransformCfg,
	},
	moduleNameMapper: {
		"^@repo/types$": "<rootDir>/../types/index.ts",
		"^@repo/api$": "<rootDir>/../api/index.ts",
		"^@repo/utils$": "<rootDir>/../utils/index.ts",
	},
};
