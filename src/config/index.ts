import path from "node:path";
import url from "node:url";
import * as importx from "importx";
import type { OverrideProperties } from "type-fest";
import * as v from "valibot";
import { metaSchema } from "../meta";

const defaultMetaSchema = v.partial(
	v.object({
		...metaSchema.entries,
		updateURL: v.function(),
		downloadURL: v.function(),
	}),
);
type DefaultMeta = OverrideProperties<
	v.InferInput<typeof defaultMetaSchema>,
	{
		updateURL?: (args: { scriptName: string; version: string }) => string;
		downloadURL?: (args: { scriptName: string; version: string }) => string;
	}
>;

export const configSchema = v.object({
	dist: v.optional(
		v.object({
			production: v.optional(v.string(), "dist"),
			dev: v.optional(v.string(), ".dev"),
		}),
		{
			production: "dist",
			dev: ".dev",
		},
	),
	defaultMeta: v.optional(defaultMetaSchema, {}),
});
export type Config = OverrideProperties<
	v.InferInput<typeof configSchema>,
	{ defaultMeta?: DefaultMeta }
>;
export type ParsedConfig = v.InferOutput<typeof configSchema>;

export const loadConfig = async () => {
	try {
		const loaded = await Promise.any(
			["bundlemonkey.config.ts", "bundlemonkey.config.js"].map(
				async (configFile) =>
					(await importx.import(
						url
							.pathToFileURL(path.resolve(process.cwd(), configFile))
							.toString(),
						import.meta.url,
					)) as unknown,
			),
		);

		const parsed = v.parse(v.object({ default: configSchema }), loaded);
		return parsed.default;
	} catch (_) {
		return v.parse(configSchema, {});
	}
};
