# Bundlemonkey

Bundlemonkey is a userscript bundler designed to make developing browser userscripts blazing fast and efficient 🔥.

With TypeScript support and type-safe header comments, managing your code becomes a breeze ✨.

Works well with [Tampermonkey](https://www.tampermonkey.net/), [Violentmonkey](https://violentmonkey.github.io/) or [Greasemonkey](https://www.greasespot.net/) ✅.

## Features ✨

- **Lightning-Fast Builds**  
  Bundlemonkey is powered by [esbuild](https://esbuild.github.io/), ensuring incredibly fast bundling speeds.

- **TypeScript Support**

- **Module Bundling**  

- **Type-Safe Header Comments**  
  Write userscript header metadata in a type-safe and straightforward way. This not only minimizes errors but also makes your code much more maintainable 🛡️.

- **Watch mode**

### Compilation Example 🛠️

#### source

```typescript
// src/sample/message.ts

export const message = "Hello from sample script and bundlemonkey!";
```

```typescript
// src/sample/index.user.ts

import { defineUserScript } from "bundlemonkey";
import { message } from "./message";

export default defineUserScript({
  name: "Sample userscript",
  version: "1.0.0",
  description: "Write userscripts with ease using bundlemonkey!",
  match: ["https://example.com/*"],
  main: () => {
    console.log(message);
  },
});
```

#### output

```typescript
// ==UserScript==
// @name         Sample userscript
// @version      1.0.0
// @description  Write userscripts with ease using bundlemonkey!
// @match        https://example.com/*
// @grant        none
// ==/UserScript==

// src/sample/message.ts
var message = "Hello from sample script and bundlemonkey!";

// src/sample/index.user.ts
void (() => {
  console.log(message);
})();
```

## Quick Start 🚀

To get started with Bundlemonkey, install it using npm, pnpm, or bun:

```bash
npm install --save bundlemonkey

# or like
pnpm add bundlemonkey
bun add bundlemonkey
```

### Setting up your directory structure

Create a directory for your userscripts by using a slug under the `src` directory. Your project structure might look like this:

<!-- https://tree.nathanfriend.com/?s=(%27options!(%27fancy3~fullPath!false~trailingSlash3~rootDot3)~5(%275%27src4a727**some-module64b02**0dist7%23%20bundled%20code%20goes%20here0bundlemonkey.config6%20%23optional0package.json%27)~version!%271%27)*%20%200%5Cn2**index.user63!true47script-5source!6.ts70*%017654320* -->
```bash
├── src/ # configurable
│   ├── script-a/
│   │   ├── index.user.ts
│   │   └── some-module.ts
│   └── script-b/
│       └── index.user.ts
├── dist/ # configurable
│   └── # bundled code goes here
├── bundlemonkey.config.ts # optional
└── package.json
```

> [!TIP]
> Source scripts are collected by glob `src/*/index.user.{ts,js}` by default, and [`srcDir`](#srcDir) is configurable.

### Write your code

`index.user.ts`/`index.user.js` must define script using `defineUserScript` and export it as the default export.

### Build

Run the following command to bundle your code:

```bash
npx bundlemonkey

# or like
pnpx bundlemonkey
bunx bundlemonkey
```

Bundlemonkey bundles your code into `dist` directory 🎉.

Watch mode are supported as well, so you can have it rebuild your scripts automatically. See [CLI](#cli-%EF%B8%8F) docs below for more details.

## CLI ⌨️

### `--watch`

Enable watch mode for automatic rebuilding during development.

### `--remote`

Use with `--watch` to enable remote watch mode.

## Configuration ⚙️

If you need to customize Bundlemonkey’s behavior, you can create a configuration file named `bundlemonkey.config.ts` or `bundlemonkey.config.js` in your project’s root directory.

### Example

`bundlemonkey.config.ts`

```typescript
import type { Config } from "bundlemonkey";

const config: Config = {
  srcDir: "src", // default value
  dist: {
    dev: ".dev", // default value
    production: "dist", // default value
  },
  defaultMeta: {
    author: "John Doe",
    namespace: "johndoe",
    homepage: "https://github.com/johndoe/userscripts",
    updateURL: ({ scriptName }) =>
      `https://github.com/johndoe/userscripts/raw/main/dist/${scriptName}.user.js`,
    downloadURL: ({ scriptName }) =>
      `https://github.com/johndoe/userscripts/raw/main/dist/${scriptName}.user.js`,
  },
};

export default config;
```

### srcDir

- type: `string`
- Default: `"src"`

Directory where your source scripts are located.

> [!NOTE]
> The glob for collecting the source files are like: `<cwd>/<srcDir>/*/index.user.{ts,js}`

### dist

- type: `object`

#### dist.dev

- type: `string`
- Default: `.dev`

Dist directory in watch mode.

#### dist.production

- type: `string`
- Default: `dist`

### defaultMeta

- type: `object`
- Default: `undefined`

Default meta used for all userscripts. Metadata defined in `defineUserScript` overrides this.

All meta properties in `defineUserScript` can be used here as well, while `updateURL`/`downloadURL` have different signatures like below.

#### defaultMeta.updateURL

- type: `(args: { scriptName: string; version: string }) => string`
- Default: `undefined`

#### defaultMeta.downloadURL

- type: `(args: { scriptName: string; version: string }) => string`
- Default: `undefined`
