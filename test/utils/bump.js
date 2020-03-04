"use strict";

const chai = require("chai");
const chaiExec = require("@jsdevtools/chai-exec");

chai.use(chaiExec);

chaiExec.defaults = {
  command: "node",
  args: "../../bin/bump.js",
  options: {
    cwd: "test/.tmp",
  },
};

module.exports = chaiExec;
