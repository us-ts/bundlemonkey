import { mkdir } from "node:fs/promises";
import path from "node:path";
import * as esbuild from "esbuild";
import { loadConfig } from "./config/index.js";
import { type Mode, userscriptsPlugin } from "./plugin/index.js";

export const main = async ({
	mode,
	scripts,
}: { mode: Mode; scripts: string[] }) => {
	const config = await loadConfig();

	const getEntryPoints = (filePaths?: string[]) =>
		scripts.flatMap((filepath) => {
			if (filePaths !== undefined && !filePaths.includes(filepath)) {
				return [];
			}

			const out = `${path.basename(
				filepath.endsWith("/index.user.ts")
					? filepath.replace(/\/index\.user\.ts$/, "")
					: filepath,
			)}.user`;
			return [{ out, in: filepath }];
		});

	const commonOptions: esbuild.BuildOptions = {
		bundle: true,
		write: false,
		charset: "utf8",
		format: "esm",
	};

	switch (mode) {
		case "dev":
		case "dev-remote": {
			await mkdir(config.dist.dev, { recursive: true });

			await Promise.all(
				getEntryPoints().map(async (entrypoint) => {
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
		case "prod": {
			await mkdir(config.dist.production, { recursive: true });

			await esbuild.build({
				...commonOptions,
				entryPoints: getEntryPoints(),
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
