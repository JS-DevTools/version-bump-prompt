"use strict";

const files = require("./files");

const mocks = module.exports = {
  /**
   * Returns information about each time `git` was executed.
   *
   * @returns {object[]}
   */
  git () {
    return mocks.all().filter(mock => mock.bin === "git");
  },

  /**
   * Returns information about each time `npm` was executed.
   *
   * @returns {object[]}
   */
  npm () {
    return mocks.all().filter(mock => mock.bin === "npm");
  },

  /**
   * Returns information about each time `git` or `npm` was executed.
   *
   * @returns {object[]}
   */
  all () {
    return files.json("mocks.json") || [];
  },

  /**
   * Records the execution of one of our mock binaries.
   *
   * @param {string} bin - The binary that was executed (e.g. "git", "npm")
   * @param {string[]} args - The CLI arguments
   */
  record (bin, args) {
    // Open the existing file, if any
    let array = files.json("mocks.json") || [];

    // Add an entry for this execution
    array.push({
      bin,

      // Record the command that was executed
      cmd: bin + " " + args.map(quoteArgs).join(" "),

      // Record the version number at the time that the command was executed
      version: files.json("package.json").version,
    });

    // Save the changes
    files.create("mocks.json", array);
  },
};

/**
 * Adds quotes around an argument if it contains whitespace characters
 *
 * @param {string} arg
 * @returns {string}
 */
function quoteArgs (arg) {
  if (/\s+/.test(arg)) {
    return `"${arg}"`;
  }
  else {
    return arg;
  }
}
