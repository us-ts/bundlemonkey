import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/index.ts", "src/bin/index.ts"],
	dts: {
		resolve: true,
	},
	format: "esm",
});
