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
	nativeTS: v.optional(v.boolean(), false),
});
export type Config = OverrideProperties<
	v.InferInput<typeof configSchema>,
	{ defaultMeta?: DefaultMeta }
>;
