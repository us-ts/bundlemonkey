import type { Meta } from "./meta/index.js";

export const defineUserScript = <C>(
	args: Meta & {
		main: (config: C) => unknown;
		config?: C;
	},
) => args;
