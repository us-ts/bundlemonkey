import { mkdir } from "node:fs/promises";
import path from "node:path";
import { styleText } from "node:util";
import * as esbuild from "esbuild";
import { glob } from "fast-glob";
import { loadConfig } from "./config/index.js";
import { type Mode, userscriptsPlugin } from "./plugin/index.js";

export const main = async ({ mode }: { mode: Mode }) => {
	const config = await loadConfig();

	const entryPoints = (
		await glob(path.resolve(config.srcDir, "./*/index.user.{j,t}s"))
	).map((filepath) => ({
		out: `${path.basename(path.dirname(filepath))}.user`,
		in: filepath,
	}));

	const commonOptions: esbuild.BuildOptions = {
		bundle: true,
		write: false,
		charset: "utf8",
		format: "esm",
	};

	console.log(styleText("blue", `Bundlemonkey started in ${mode} mode\n`));

	switch (mode) {
		case "watch":
		case "watchRemote": {
			await mkdir(config.dist.dev, { recursive: true });

			await Promise.all(
				entryPoints.map(async (entrypoint) => {
					const context = await esbuild.context({
						...commonOptions,
						entryPoints: [entrypoint],
						outdir: config.dist.dev,
						plugins: [
							userscriptsPlugin({
								mode,
								defaultMeta: config.defaultMeta,
							}),
						],
					});

					await context.watch();
				}),
			);
			break;
		}
		case "production": {
			await mkdir(config.dist.production, { recursive: true });

			await esbuild.build({
				...commonOptions,
				entryPoints: entryPoints,
				outdir: config.dist.production,
				plugins: [
					userscriptsPlugin({
						mode,
						defaultMeta: config.defaultMeta,
					}),
				],
			});
			break;
		}
		default: {
			mode satisfies never;
		}
	}
};
