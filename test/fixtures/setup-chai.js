"use strict";

const chai = require("chai");
const chaiExec = require("chai-exec");

chai.use(chaiExec);
chai.should();

chaiExec.defaults = {
  command: "node",
  args: "../../bin/bump.js",
  options: {
    cwd: "test/.tmp",
  },
};
