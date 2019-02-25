"use strict";

const commonJSExport = require("../../");
const { default: defaultExport, versionBump: namedExport } = require("../../");

describe("version-bump-prompt module exports", () => {

  it("should export the versionBump() function as the default CommonJS export", () => {
    commonJSExport.should.be.a("function");
    commonJSExport.name.should.equal("versionBump");
  });

  it("should export the versionBump() function as the default ESM export", () => {
    defaultExport.should.be.a("function");
    defaultExport.should.equal(commonJSExport);
  });

  it("should export the versionBump() function as a named export", () => {
    namedExport.should.be.a("function");
    namedExport.should.equal(commonJSExport);
  });

  it("should not export anything else", () => {
    Object.keys(commonJSExport).should.have.same.members([
      "default",
      "versionBump",
    ]);
  });

});
