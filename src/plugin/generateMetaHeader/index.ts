import type { ParsedConfig } from "../../config";
import type { Meta } from "../../meta";

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

	const headerItemPair = (
		key: string,
		value: string | undefined,
	): [string, string] | undefined =>
		value === undefined ? undefined : [key, value];

	const headerMainParts = (
		[
			headerItemPair("name", mergedMeta.name),
			headerItemPair("namespace", mergedMeta.namespace),
			headerItemPair("version", mergedMeta.version),
			headerItemPair("description", mergedMeta.description),
			headerItemPair("author", mergedMeta.author ?? mergedMeta.namespace),
			headerItemPair("homepage", mergedMeta.homepage),
			headerItemPair("homepageURL", mergedMeta.homepage),
			headerItemPair("updateURL", mergedMeta.updateURL),
			headerItemPair("downloadURL", mergedMeta.downloadURL),
			...mergedMeta.match.map((m) => headerItemPair("match", m)),
			headerItemPair("icon", mergedMeta.icon),
			headerItemPair("run-at", mergedMeta.runAt),
			...(mergedMeta.grant === undefined
				? [headerItemPair("grant", "none")]
				: (mergedMeta.grant ?? []).map((g) => headerItemPair("grant", g))),
			...(mergedMeta.require ?? []).map((r) => headerItemPair("require", r)),
			...(mergedMeta.connect ?? []).map((c) => headerItemPair("connect", c)),
		] satisfies Array<[string, string] | undefined>
	)
		.filter((v) => v !== undefined)
		.flatMap(([key, value]) =>
			value === undefined ? [] : [`// @${key.padEnd(12)} ${value}`],
		);

	return ["// ==UserScript==", headerMainParts, "// ==/UserScript=="]
		.flat()
		.flatMap((s) => (s ? [s] : []))
		.join("\n");
};
