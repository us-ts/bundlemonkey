import { typescriptWithBiome } from "@mkobayashime/shared-config/eslint";

export default [
	{
		ignores: [".tsup", "dist", "templates"],
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
