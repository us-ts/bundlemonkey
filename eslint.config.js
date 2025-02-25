import { typescriptWithBiome } from "@mkobayashime/shared-config/eslint";

export default [
	{
		ignores: [".tsup", "dist"],
	},
	...typescriptWithBiome,
	{
		languageOptions: {
			parserOptions: {
				project: "./tsconfig.json",
			},
		},
	},
];
