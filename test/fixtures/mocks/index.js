"use strict";

const fs = require("fs");
const path = require("path");
const files = require("../files");

// Ensure that the mock binaries are executable
fs.chmodSync(path.join(__dirname, "git"), "0777");
fs.chmodSync(path.join(__dirname, "npm"), "0777");

// Inject our mocks directory path into the PATH variable,
// so that version-bump-prompt runs our mock `git` and `npm` binaries
// instead of the real ones.
let otherPaths = getEnvPath();
process.env.PATH = __dirname + path.delimiter + otherPaths; // eslint-disable-line no-path-concat

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
 * Returns the PATH environment variable, case-insensitively
 */
function getEnvPath () {
  let keys = Object.keys(process.env);

  for (let key of keys) {
    if (key.toUpperCase() === "PATH") {
      return process.env[key];
    }
  }
}

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
