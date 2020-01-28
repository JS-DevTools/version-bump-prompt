"use strict";

const fs = require("fs");
const path = require("path");

const tempDir = path.resolve(__dirname, "..", ".tmp");

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

    let filePath = path.join(tempDir, name);
    let dirPath = path.dirname(filePath);

    fs.mkdirSync(dirPath, { recursive: true });
    fs.writeFileSync(filePath, contents);
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
