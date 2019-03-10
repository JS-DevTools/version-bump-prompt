"use strict";

const stripAnsi = require("strip-ansi");
const logSymbols = require("log-symbols");

module.exports = {
  /**
   * The check symbol (✔ on Mac/Linux, √ on Windows)
   * with the ANSI color sequences removed
   */
  check: stripAnsi(logSymbols.success),

  /**
   * The check symbol (ℹ on Mac/Linux, i on Windows)
   * with the ANSI color sequences removed
   */
  info: stripAnsi(logSymbols.info),
};
