import type { Meta } from "./meta/index.js";

export const defineUserScript = (
	args: Meta & {
		main: () => unknown;
	},
) => args;
