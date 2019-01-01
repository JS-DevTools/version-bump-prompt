"use strict";

const versionBump = require("../../");
const defaultExport = require("../../");
const { versionBump: namedExport } = require("../../");
const mocks = require("../fixtures/mocks");
const files = require("../fixtures/files");

describe("versionBup() API", () => {

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

  it("should work without any arguments", async () => {
    files.create("package.json", { version: "1.0.0" });

    // Change the cwd, since we're not setting the `cwd` option
    process.chdir("test/.tmp");

    let results = await versionBump();

    results.should.deep.equal({

    });

    // Git and NPM should NOT have been called
    mocks.git().should.be.empty;
    mocks.npm().should.be.empty;

    // Restore the previous cwd
    process.chdir("../..");
  });

  it.only("should accept a specific version number", async () => {
    files.create("package.json", { version: "1.0.0" });

    // Change the cwd, since we're not setting the `cwd` option
    process.chdir("test/.tmp");

    let results = await versionBump("2.34.567");

    results.should.deep.equal({
      oldVersion: "1.0.0",
      newVersion: "2.34.567",
      commit: false,
      tag: false,
      files: [
        "package.json",
        "package-lock.json",
      ],
    });

    // Git and NPM should NOT have been called
    mocks.git().should.be.empty;
    mocks.npm().should.be.empty;

    // Restore the previous cwd
    process.chdir("../..");
  });

  it("should accept a bump type", async () => {
    files.create("package.json", { version: "1.0.0" });

    // Change the cwd, since we're not setting the `cwd` option
    process.chdir("test/.tmp");

    let results = await versionBump("minor");

    results.should.deep.equal({

    });

    // Git and NPM should NOT have been called
    mocks.git().should.be.empty;
    mocks.npm().should.be.empty;

    // Restore the previous cwd
    process.chdir("../..");
  });

  it("should accept an empty options object", async () => {
    files.create("package.json", { version: "1.0.0" });

    // Change the cwd, since we're not setting the `cwd` option
    process.chdir("test/.tmp");

    let results = await versionBump({});

    results.should.deep.equal({

    });

    // Git and NPM should NOT have been called
    mocks.git().should.be.empty;
    mocks.npm().should.be.empty;

    // Restore the previous cwd
    process.chdir("../..");
  });

  it("should accept options", async () => {
    files.create("package.json", { version: "1.0.0" });

    let results = await versionBump({
      cwd: "test/.tmp",
      version: "preminor",
      preid: "test",
      commit: "A test of the upcoming v",
      tag: "",
    });

    results.should.deep.equal({

    });

    // A git commit and tag should have been created
    mocks.git().should.deep.equal([
      'git commit package.json -m "release v2.0.0"',
      'git tag package.json -m "release v2.0.0"',
    ]);

    // NPM should NOT have been called
    mocks.npm().should.be.empty;
  });

});
