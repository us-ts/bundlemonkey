import { defineUserScript } from "../../../..";
import { message } from "./module";

export default defineUserScript({
	name: "arrow function",
	version: "0.1.0",
	description: "",
	match: ["https://example.com/*"],
	config: {
		foo: "bar",
	},
	main: ({ foo }) => {
		console.log(message);

		console.log(foo);
	},
});
