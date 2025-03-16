import { mkdir } from "node:fs/promises";
import path from "node:path";
import { styleText } from "node:util";
import * as esbuild from "esbuild";
import { glob } from "glob";
import { type ParsedConfig, loadConfig } from "./config/index.js";
import { type Mode, userscriptsPlugin } from "./plugin/index.js";

const getEntryPoints = async (srcDir: string) =>
	(await glob(path.resolve(srcDir, "./*/index.user.{j,t}s"))).map(
		(filepath) => ({
			out: `${path.basename(path.dirname(filepath))}.user`,
			in: filepath,
		}),
	);

const getCommonOptions = ({
	entryPoint,
	defaultMeta,
	mode,
	onBuildEnd,
}: {
	entryPoint: {
		in: string;
		out: string;
	};
	defaultMeta: ParsedConfig["defaultMeta"];
	mode: Mode;
	onBuildEnd?: (output: { path: string; content: string }) => void;
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
				defaultMeta,
				mode,
				scriptName,
				onBuildEnd,
			}),
		],
	};
};

export const build = async (): Promise<
	Array<
		| {
				path: string;
				content: string;
		  }
		| undefined
	>
> => {
	console.log(styleText("blue", "Bundlemonkey started in production mode\n"));

	const config = await loadConfig();

	const entryPoints = await getEntryPoints(config.srcDir);

	await mkdir(config.dist.production, { recursive: true });

	return await Promise.all(
		entryPoints.map(async (entryPoint) => {
			let output: { path: string; content: string } | undefined;

			await esbuild.build({
				...getCommonOptions({
					entryPoint,
					defaultMeta: config.defaultMeta,
					mode: "production",
					onBuildEnd: (c) => {
						output = c;
					},
				}),
				outdir: config.dist.production,
			});

			return output;
		}),
	);
};

export const watch = async ({ remote }: { remote: boolean }) => {
	console.log(
		styleText(
			"blue",
			`Bundlemonkey started in ${remote ? "remote watch" : "watch"} mode\n`,
		),
	);

	const config = await loadConfig();

	const entryPoints = await getEntryPoints(config.srcDir);

	await mkdir(config.dist.dev, { recursive: true });

	await Promise.all(
		entryPoints.map(async (entryPoint) => {
			const context = await esbuild.context({
				...getCommonOptions({
					entryPoint,
					defaultMeta: config.defaultMeta,
					mode: remote ? "watchRemote" : "watch",
				}),
				outdir: config.dist.dev,
			});

			await context.watch();
		}),
	);
};
