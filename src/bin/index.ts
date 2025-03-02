#!/usr/bin/env node

import { parseArgs } from "node:util";
import { main } from "../main";

const { values, positionals: scripts } = parseArgs({
	args: process.argv.slice(2),
	options: {
		watch: {
			type: "boolean",
			short: "W",
			default: false,
		},
		remote: {
			type: "boolean",
			default: false,
		},
	},
	allowPositionals: true,
});

const mode = values.watch
	? values.remote
		? "watchRemote"
		: "watch"
	: "production";

await main({ mode, scripts });
