import { defineUserScript } from "../../../..";
import { message } from "./module";

export default defineUserScript({
	name: "method",
	version: "0.1.0",
	description: "",
	match: ["https://example.com/*"],
	main() {
		console.log(message);
	},
});
