"use strict";

const defaultExport = require("../../");
const { versionBump: namedExport } = require("../../");

describe("version-bump-prompt module exports", () => {

  it("should export the versionBump() function as the default export", () => {
    defaultExport.should.be.a("function");
    defaultExport.should.have.property("default");
    defaultExport.default.should.equal(defaultExport);
  });

  it("should export the versionBump() function as a named export", () => {
    defaultExport.should.have.property("versionBump");
    namedExport.should.be.a("function");
    namedExport.should.equal(defaultExport);
  });

  it("should not export anything else", () => {
    Object.keys(defaultExport).should.have.same.members([
      "default",
      "versionBump",
    ]);
  });

});
