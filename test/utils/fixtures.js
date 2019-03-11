"use strict";

const fs = require("fs");
const path = require("path");

const filesDir = path.resolve("test", "fixtures", "files");

module.exports = {
  license: fs.readFileSync(path.join(filesDir, "LICENSE"), "utf8"),
  readme: fs.readFileSync(path.join(filesDir, "README.md"), "utf8"),
  script1: fs.readFileSync(path.join(filesDir, "script1.js"), "utf8"),
  script2: fs.readFileSync(path.join(filesDir, "script2.js"), "utf8"),
};
