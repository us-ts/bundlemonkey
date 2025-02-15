import { defineUserScript } from "../../..";
import { message } from "./module";

export default defineUserScript({
	name: "function",
	version: "0.1.0",
	description: "",
	match: ["https://example.com/*"],
	// biome-ignore lint/complexity/useArrowFunction: <explanation>
	main: function () {
		console.log(message);
	},
});
