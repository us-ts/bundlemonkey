import { defineUserScript } from "../../../..";
import { message } from "./module";

export default defineUserScript({
	name: "arrow function",
	version: "0.1.0",
	description: "",
	match: ["https://example.com/*"],
	config: {
		/**
		 * @type string
		 */
		foo: "bar",
	},
	main: ({ foo }) => {
		/**
		 * output imported message
		 */
		console.log(message);

		// output config
		console.log(foo);
	},
});
