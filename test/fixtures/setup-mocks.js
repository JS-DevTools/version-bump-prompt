"use strict";

const fs = require("fs");
const path = require("path");

const mocksDir = path.resolve("test", "fixtures", "mocks");

// Ensure that the mock binaries are executable
fs.chmodSync(path.join(mocksDir, "git"), "0777");
fs.chmodSync(path.join(mocksDir, "npm"), "0777");

// Inject our mocks directory path into the PATH variable,
// so that version-bump-prompt runs our mock `git` and `npm` binaries
// instead of the real ones.
let otherPaths = getEnvPath();
process.env.PATH = mocksDir + path.delimiter + otherPaths; // eslint-disable-line no-path-concat


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
