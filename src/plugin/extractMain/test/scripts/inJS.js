import { defineUserScript } from "../../../..";

export default defineUserScript({
	name: "in JS",
	version: "0.1.0",
	description: "",
	match: ["https://example.com/*"],
	main: () => {
		console.log("hello from js");
	},
});
