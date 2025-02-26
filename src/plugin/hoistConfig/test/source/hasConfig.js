console.log("hello");

var userscriptConfig = {
	/**
	 * @type string
	 */
	message: "world",
};

void (({ message }) => {
	console.log(message);
})(userscriptConfig);
