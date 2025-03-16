import type { Meta } from "./meta/index.js";

export type { Config } from "./config/index.js";

export const defineUserScript = <C>(
	args: Meta & {
		main: (config: C) => unknown;
		config?: C;
	},
) => args;

export { build, watch } from "./main.js";
