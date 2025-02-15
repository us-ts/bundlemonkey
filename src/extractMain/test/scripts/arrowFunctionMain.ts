import { defineUserScript } from "../../..";
import { message } from "./module";

export default defineUserScript({
	name: "arrow function",
	version: "0.1.0",
	description: "",
	match: ["https://example.com/*"],
	main: () => {
		// @preserve scriptConfig
		const config = {
			foo: "bar",
		};

		console.log(message);

		void (({ foo }) => {
			console.log(foo);
		})(config);
	},
});
