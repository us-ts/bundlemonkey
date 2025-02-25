import type { ParsedConfig } from "../config";
import type { Meta } from "../meta";

export const generateMetaHeader = ({
	meta,
	defaultMeta,
	scriptName,
}: {
	meta: Meta;
	defaultMeta: ParsedConfig["defaultMeta"];
	scriptName: string;
}) => {
	const updateURL = (() => {
		const generatedUpdateURL = defaultMeta.updateURL?.({
			scriptName,
			version: meta.version,
		});

		if (defaultMeta.updateURL) {
			if (typeof generatedUpdateURL === "string") {
				return generatedUpdateURL;
			}

			console.warn(
				"Warning: `defaultMeta.updateURL` must return string value.",
			);
		}

		return meta.updateURL;
	})();

	const downloadURL = (() => {
		const generatedDownloadURL = defaultMeta.downloadURL?.({
			scriptName,
			version: meta.version,
		});

		if (defaultMeta.downloadURL) {
			if (typeof generatedDownloadURL === "string") {
				return generatedDownloadURL;
			}

			console.warn(
				"Warning: `defaultMeta.downloadURL` must return string value.",
			);
		}

		return meta.downloadURL;
	})();

	const mergedMeta: Meta = {
		...defaultMeta,
		...meta,
		updateURL,
		downloadURL,
	};

	return [
		"// ==UserScript==",
		`// @name         ${mergedMeta.name}`,
		mergedMeta.namespace
			? `// @namespace    ${mergedMeta.namespace}`
			: undefined,
		`// @version      ${mergedMeta.version}`,
		`// @description  ${mergedMeta.description}`,
		mergedMeta.author || mergedMeta.namespace
			? `// @author       ${mergedMeta.author ?? mergedMeta.namespace}`
			: undefined,
		mergedMeta.homepage
			? [
					`// @homepage     ${mergedMeta.homepage}`,
					`// @homepageURL  ${mergedMeta.homepage}`,
				]
			: undefined,
		mergedMeta.updateURL
			? `// @updateURL    ${mergedMeta.updateURL}`
			: undefined,
		mergedMeta.downloadURL
			? `// @downloadURL  ${mergedMeta.downloadURL}`
			: undefined,
		mergedMeta.match.map((matchString) => `// @match        ${matchString}`),
		mergedMeta.icon && `// @icon         ${mergedMeta.icon}`,
		mergedMeta.runAt && `// @run-at       ${mergedMeta.runAt}`,
		mergedMeta.grant === undefined
			? "// @grant        none"
			: mergedMeta.grant.length === 0
				? undefined
				: mergedMeta.grant.map((g) => `// @grant        ${g}`),
		...(mergedMeta.require ?? []).map((url) => `// @require      ${url}`),
		(mergedMeta.connect ?? []).map((value) => `// @connect      ${value}`),
		"// ==/UserScript==",
	]
		.flat()
		.flatMap((s) => (s ? [s] : []))
		.join("\n");
};
