#!/usr/bin/env node

import { cp } from "node:fs/promises";
import path from "node:path";
import { parseArgs, styleText } from "node:util";
import { input } from "@inquirer/prompts";
import { main } from "../main";

void (async () => {
	const { values } = parseArgs({
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
			create: {
				type: "boolean",
				default: false,
			},
		},
		allowPositionals: true,
	});

	if (values.create) {
		const projectName = await input({ message: "Name of the project" });
		const projectPath = path.resolve(process.cwd(), projectName);

		await cp(
			path.resolve(import.meta.dirname, "../../templates/template-typescript"),
			projectPath,
			{ recursive: true },
		);

		console.log(
			styleText("green", `Successfully created project: ${projectName}`),
		);

		return;
	}

	const mode = values.watch
		? values.remote
			? "watchRemote"
			: "watch"
		: "production";

	await main({ mode });
})();
