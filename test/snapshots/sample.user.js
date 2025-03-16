// ==UserScript==
// @name         arrow function
// @version      0.1.0
// @description
// @match        https://example.com/*
// ==/UserScript==

var userscriptConfig = {
  /**
   * @type string
   */
  foo: "bar"
};

// test/src/sample/message.ts
var message = "hello";

// test/src/sample/index.user.ts
void (({ foo }) => {
  console.log(message);
  console.log(foo);
})(userscriptConfig);