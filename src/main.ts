import { mkdir } from "node:fs/promises";
import path from "node:path";
import { styleText } from "node:util";
import * as esbuild from "esbuild";
import { glob } from "glob";
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

	const getCommonOptions = (entryPoint: {
		in: string;
		out: string;
	}): esbuild.BuildOptions => {
		const scriptName = path.basename(path.dirname(entryPoint.in));

		if (!scriptName) {
			throw new Error(
				`Failed to get scriptName from entryPoint path: ${entryPoint.in}`,
			);
		}

		return {
			entryPoints: [entryPoint],
			bundle: true,
			write: false,
			charset: "utf8",
			format: "esm",
			legalComments: "inline",
			plugins: [
				userscriptsPlugin({
					defaultMeta: config.defaultMeta,
					mode,
					scriptName,
				}),
			],
		};
	};

	console.log(styleText("blue", `Bundlemonkey started in ${mode} mode\n`));

	switch (mode) {
		case "watch":
		case "watchRemote": {
			await mkdir(config.dist.dev, { recursive: true });

			await Promise.all(
				entryPoints.map(async (entryPoint) => {
					const context = await esbuild.context({
						...getCommonOptions(entryPoint),
						outdir: config.dist.dev,
					});

					await context.watch();
				}),
			);
			break;
		}
		case "production": {
			await mkdir(config.dist.production, { recursive: true });

			await Promise.all(
				entryPoints.map(async (entryPoint) => {
					await esbuild.build({
						...getCommonOptions(entryPoint),
						outdir: config.dist.production,
					});
				}),
			);
			break;
		}
		default: {
			mode satisfies never;
		}
	}
};
