#!/usr/bin/env node

import { parseArgs } from "node:util";
import { main } from "../main";

const { values, positionals: scripts } = parseArgs({
	args: process.argv.slice(2),
	options: {
		mode: {
			type: "string",
			short: "M",
			default: "build",
		},
	},
	allowPositionals: true,
});

const mode =
	values.mode === "dev" || values.mode === "dev-remote" ? values.mode : "prod";

await main({ mode, scripts });
