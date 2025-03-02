import { defineUserScript } from "../../../..";

export default defineUserScript({
	name: "async function",
	version: "0.1.0",
	description: "",
	match: ["https://example.com/*"],
	main: async () => {
		await new Promise((resolve) => globalThis.setTimeout(resolve, 1000));
	},
});
