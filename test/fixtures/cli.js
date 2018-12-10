"use strict";

const path = require("path");
const spawnSync = require("cross-spawn").sync;

const cliPath = path.resolve("bin/bump.js");

module.exports = { exec };

/**
 * Runs bump with the given arguments.
 *
 * @param {string} args - The args to run bump with
 */
function exec (args) {
  // Run bump
  args = [cliPath].concat(args.split(" "));
  let output = spawnSync("node", args, {
    encoding: "utf8",
    cwd: path.resolve("test/.tmp"),
  });

  // Check for errors
  if (output.error) {
    throw output.error;
  }

  // Create an array containing each line of output
  output.lines = [];
  if (output.stdout) {
    output.lines = output.stdout.split("\n");

    let lastLine = output.lines[output.lines.length - 1];
    if (lastLine === "") {
      output.lines.pop();
    }
  }

  return output;
}
