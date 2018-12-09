"use strict";

const stripAnsi = require("strip-ansi");
const logSymbols = require("log-symbols");

// Export the check symbol (✔ on Mac/Linux, √ on Windows)
// with the ANSI color sequences removed
module.exports = stripAnsi(logSymbols.success);
