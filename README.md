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

## Compilation Example 🚀

### source

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

### output
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
