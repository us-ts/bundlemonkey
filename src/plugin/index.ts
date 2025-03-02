import { writeFile } from "node:fs/promises";
import path from "node:path";
import url from "node:url";
import { styleText } from "node:util";
import clipboard from "clipboardy";
import type * as esbuild from "esbuild";
import * as importx from "importx";
import * as v from "valibot";
import type { ParsedConfig } from "../config";
import { type Meta, metaSchema } from "../meta";
import { extractMain } from "./extractMain";
import { generateMetaHeader } from "./generateMetaHeader";
import { hoistConfig } from "./hoistConfig";

export type Mode = "production" | "watch" | "watchRemote";

export const userscriptsPlugin = ({
	mode,
	defaultMeta,
}: {
	mode: Mode;
	defaultMeta: ParsedConfig["defaultMeta"];
}): esbuild.Plugin => {
	const metaStore: Record<string, Meta> = {};

	let initialBundleFinished = false;
	let remoteModeScriptBundleFinished = false;

	return {
		name: "userscripts",
		setup: (build) => {
			build.onLoad({ filter: /\.user\.(t|j)s$/ }, async (args) => {
				const scriptName = path.basename(path.dirname(args.path));

				if (!scriptName) {
					throw new Error(
						`Failed to get name of the script from path: ${args.path}`,
					);
				}

				try {
					const imported = (await importx.import(
						url
							.pathToFileURL(
								path.resolve(
									process.cwd(),
									/**
									 * disable ESM cache forcibly
									 */
									`${args.path}?t=${Date.now()}`,
								),
							)
							.toString(),
						import.meta.url,
					)) as unknown;

					const { default: parsedMeta } = v.parse(
						v.object({ default: metaSchema }),
						imported,
					);

					metaStore[scriptName] = parsedMeta;
				} catch (err) {
					console.error(err);
				}

				const sourceWithMainExtracted = await extractMain(args.path);

				return {
					contents: sourceWithMainExtracted,
					loader: "ts",
				};
			});

			build.onEnd(async (result) => {
				for (const file of result.outputFiles ?? []) {
					const scriptName = path
						.basename(file.path)
						.replace(/\.user\.(j|t)s$/, "");
					if (!scriptName) {
						throw new Error(`Failed to get scriptName from path: ${file.path}`);
					}

					const meta = metaStore[scriptName];
					if (!meta) {
						throw new Error(`Failed to get meta for script: ${scriptName}`);
					}

					const metaHeader = generateMetaHeader({
						meta,
						defaultMeta,
						scriptName,
					});

					const finalCode = `${metaHeader}\n\n${hoistConfig(file.text)}`;

					switch (mode) {
						case "production": {
							await writeFile(file.path, finalCode);
							console.log(styleText("green", `Bundled ${scriptName}`));

							break;
						}
						case "watch":
						case "watchRemote": {
							if (!initialBundleFinished) {
								initialBundleFinished = true;
								break;
							}

							if (mode === "watchRemote" && !remoteModeScriptBundleFinished) {
								const remoteModeScript = generateMetaHeader({
									meta: {
										...meta,
										require: [...(meta.require ?? []), `file://${file.path}`],
									},
									defaultMeta,
									scriptName,
								});

								await clipboard.write(remoteModeScript);
								console.log(
									styleText(
										"green",
										`Copied remote mode script for ${scriptName}\n`,
									),
								);

								remoteModeScriptBundleFinished = true;
							}

							await writeFile(file.path, finalCode);

							if (mode === "watch") {
								await clipboard.write(finalCode);
							}

							console.log(styleText("green", `Bundled ${scriptName}`));

							break;
						}
						default: {
							mode satisfies never;
						}
					}
				}
			});
		},
	};
};
