import type { OverrideProperties } from "type-fest";
import path from "node:path";
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
	nativeTS: v.optional(v.boolean(), false),
});
export type Config = OverrideProperties<
	v.InferInput<typeof configSchema>,
	{ defaultMeta?: DefaultMeta }
>;

export const loadConfig = async () => {
	try {
		const loaded = await Promise.any(
			["bundlemonkey.config.ts", "bundlemonkey.config.js"].map(
				async (configFile) =>
					(await import(path.resolve(process.cwd(), configFile))) as unknown,
			),
		);

		const parsed = v.parse(v.object({ default: configSchema }), loaded);
		return parsed.default;
	} catch (_) {
		return v.parse(configSchema, {});
	}
};
