import { describe, expect, it } from "vitest";
import { generateMetaHeader } from ".";
import type { Config, ParsedConfig } from "../../config";

describe(generateMetaHeader, () => {
	it("generates meta header comment", () => {
		expect(
			generateMetaHeader({
				meta: {
					name: "Test Script",
					version: "1.0.0",
					description: "test description",
					match: [],
					grant: "none",
				},
				defaultMeta: {},
				scriptName: "test-script",
			}),
		).toMatchInlineSnapshot(`
			"// ==UserScript==
			// @name         Test Script
			// @version      1.0.0
			// @description  test description
			// @grant        none
			// ==/UserScript=="
		`);

		expect(
			generateMetaHeader({
				meta: {
					name: "",
					version: "",
					description: "",
					match: [],
				},
				defaultMeta: {},
				scriptName: "test-script",
			}),
		).toMatchInlineSnapshot(`
			"// ==UserScript==
			// @name         
			// @version      
			// @description  
			// ==/UserScript=="
		`);

		expect(
			generateMetaHeader({
				meta: {
					name: "Test Script",
					namespace: "test-namespace",
					version: "1.0.0",
					description: "test description",
					match: ["https://example.com/*", "https://foobar.example.com/*"],
					icon: "https://example.com/icon.png",
					grant: ["unsafeWindow", "GM.xmlHttpRequest"],
					author: "test-author",
					homepage: "https://example.com/userscripts",
					require: ["https://example.com/foo", "https://example.com/bar"],
					runAt: "document-end",
					connect: ["example.com", "localhost"],
					updateURL: "https://example.com/userscripts/test-script.user.js",
					downloadURL: "https://example.com/userscripts/test-script.user.js",
				},
				defaultMeta: {},
				scriptName: "test-script",
			}),
		).toMatchInlineSnapshot(`
			"// ==UserScript==
			// @name         Test Script
			// @namespace    test-namespace
			// @version      1.0.0
			// @description  test description
			// @author       test-author
			// @homepage     https://example.com/userscripts
			// @homepageURL  https://example.com/userscripts
			// @updateURL    https://example.com/userscripts/test-script.user.js
			// @downloadURL  https://example.com/userscripts/test-script.user.js
			// @match        https://example.com/*
			// @match        https://foobar.example.com/*
			// @icon         https://example.com/icon.png
			// @run-at       document-end
			// @grant        unsafeWindow
			// @grant        GM.xmlHttpRequest
			// @require      https://example.com/foo
			// @require      https://example.com/bar
			// @connect      example.com
			// @connect      localhost
			// ==/UserScript=="
		`);
	});

	it("respects defaultMeta", () => {
		const defaultMeta: Config["defaultMeta"] = {
			author: "test-author",
			namespace: "test-namespace",
			downloadURL: ({ scriptName, version }) =>
				`https://example.com/userscripts/${scriptName}-${version}.user.js`,
			updateURL: ({ scriptName, version }) =>
				`https://example.com/userscripts/${scriptName}-${version}.user.js`,
		};

		expect(
			generateMetaHeader({
				meta: {
					name: "Test Script",
					version: "1.0.0",
					description: "test description",
					match: [],
				},
				defaultMeta: defaultMeta as ParsedConfig["defaultMeta"],
				scriptName: "test-script",
			}),
		).toMatchInlineSnapshot(`
			"// ==UserScript==
			// @name         Test Script
			// @namespace    test-namespace
			// @version      1.0.0
			// @description  test description
			// @author       test-author
			// @updateURL    https://example.com/userscripts/test-script-1.0.0.user.js
			// @downloadURL  https://example.com/userscripts/test-script-1.0.0.user.js
			// ==/UserScript=="
		`);
	});
});
