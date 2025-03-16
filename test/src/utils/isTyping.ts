const inputTags = ["INPUT", "TEXTAREA", "SELECT"];

export const isTyping = () => {
	const { activeElement } = document;
	if (!(activeElement instanceof HTMLElement)) return;

	return (
		inputTags.includes(activeElement.tagName.toUpperCase()) ||
		activeElement.role === "textbox" ||
		activeElement.contentEditable === "true"
	);
};
