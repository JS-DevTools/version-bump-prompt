"use strict";

const chai = require("chai");
const chaiExec = require("chai-exec");

module.exports = {
  chaiExec,
  expect: chai.expect,
};

chai.use(chaiExec);
chai.should();

chaiExec.defaults = {
  command: "node",
  args: "../../bin/bump.js",
  options: {
    cwd: "test/.tmp",
  },
};
