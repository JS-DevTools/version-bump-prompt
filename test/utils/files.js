"use strict";

const fs = require("fs");
const path = require("path");

const filesDir = path.resolve("test", "fixtures", "files");
const tempDir = path.resolve("test", ".tmp");

const files = module.exports = {
  /**
   * Creates a file in the "test/.tmp" directory with the given contents
   *
   * @param {string} name - The file name (e.g. "package.json")
   * @param {string|object} [contents] - The file contents
   */
  create (name, contents) {
    if (typeof contents === "object") {
      contents = JSON.stringify(contents, null, 2);
    }
    fs.writeFileSync(path.join(tempDir, name), contents);
  },

  /**
   * Copies a file from the "test/fixtures/files" directory to the "test/.tmp" directory.
   *
   * @param {string} name - The name of the file to copy (e.g. "README.md", "script1.js")
   */
  copy (name) {
    let contents = fs.readFileSync(path.join(filesDir, name), "utf8");
    files.create(name, contents);
  },

  /**
   * Reads a file in the "test/.tmp" directory, and returns its contents as a string.
   *
   * @param {string} name - The file name (e.g. "README.md", "script1.js")
   * @returns {object}
   */
  text (name) {
    try {
      return fs.readFileSync(path.join(tempDir, name), "utf8");
    }
    catch (e) {
      return "";
    }
  },

  /**
   * Parses a JSON file in the "test/.tmp" directory, and returns its contents
   * as a JavaScript object.
   *
   * @param {string} name - The file name (e.g. "package.json")
   * @returns {object|undefined}
   */
  json (name) {
    try {
      let json = files.text(name);
      return JSON.parse(json);
    }
    catch (e) {
      return undefined;
    }
  },
};
