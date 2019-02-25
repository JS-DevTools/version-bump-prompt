"use strict";

const versionBump = require("../../");
const { files, mocks } = require("../utils");
const { expect } = require("../utils/chai");

const ORIGINAL_CWD = process.cwd();

describe("versionBup() API", () => {
  afterEach("restore the CWD", () => {
    // Many of the tests in this file change the CWD, so change it back after each test
    process.chdir(ORIGINAL_CWD);
  });

  it("should accept a specific version number", async () => {
    files.create("package.json", { version: "1.0.0" });

    // Change the cwd, since we're not setting the `cwd` option
    process.chdir("test/.tmp");

    let results = await versionBump("2.34.567");

    results.should.deep.equal({
      release: undefined,
      oldVersion: "1.0.0",
      newVersion: "2.34.567",
      commit: false,
      tag: false,
      files: ["package.json"],
    });

    // The package.json file should have been updated
    expect(files.json("package.json")).to.deep.equal({ version: "2.34.567" });

    // Git and NPM should NOT have been called
    expect(mocks.git()).to.be.empty;
    expect(mocks.npm()).to.be.empty;
  });

  it("should accept a bump type", async () => {
    files.create("package.json", { version: "1.0.0" });

    // Change the cwd, since we're not setting the `cwd` option
    process.chdir("test/.tmp");

    let results = await versionBump("minor");

    results.should.deep.equal({
      release: "minor",
      oldVersion: "1.0.0",
      newVersion: "1.1.0",
      commit: false,
      tag: false,
      files: ["package.json"],
    });

    // The package.json file should have been updated
    expect(files.json("package.json")).to.deep.equal({ version: "1.1.0" });

    // Git and NPM should NOT have been called
    expect(mocks.git()).to.be.empty;
    expect(mocks.npm()).to.be.empty;
  });

  it.skip("should accept options", async () => {
    files.create("package.json", { version: "1.0.0" });
    files.create("README.md", "The latest release is v1.0.0\n");
    files.create("random-file.json", {
      name: "v1.0.0",
      version: "1.0.0",
      desc: "This is version 1.0.0.",
    });

    let results = await versionBump({
      release: "preminor",
      preid: "test",
      commit: "A test of the upcoming v",
      tag: "",
      cwd: "test/.tmp",
      files: [
        "random-file.json",
        "**/*.md",
      ]
    });

    results.should.deep.equal({
      release: "preminor",
      oldVersion: "1.0.0",
      newVersion: "1.1.0-test.1",
      commit: "A test of the upcoming v1.1.0-test.1",
      tag: "1.1.0-test.1",
      files: [
        "random-file.json",
        "README.md"
      ],
    });

    // The CWD should not have changed
    expect(process.cwd()).to.equal(ORIGINAL_CWD);

    // The package.json file should NOT have been updated, because it wasn't in the `files` list
    expect(files.json("package.json")).to.deep.equal({ version: "1.0.0" });

    // The other two files should have been updated
    files.text("README.md", "The latest release is v1.1.0-test.1\n");
    files.json("random-file.json").should.deep.equal({
      name: "v1.1.0-test.1",
      version: "1.1.0-test.1",
      desc: "This is version 1.1.0-test.1.",
    });

    // A git commit and tag should have been created
    mocks.git().should.deep.equal([
      'git commit package.json -m "release v2.0.0"',
      'git tag package.json -m "release v2.0.0"',
    ]);

    // NPM should NOT have been called
    expect(mocks.npm()).to.be.empty;
  });

  it("should throw an error if the options are invalid", async () => {
    try {
      let results = await versionBump({ release: "hello world" });
      throw new Error(
        "An error should have been thrown, but results were returned:\n" +
        JSON.stringify(results, null, 2)
      );
    }
    catch (error) {
      expect(error).to.be.an.instanceOf(Error);
      expect(error.message).to.equal("Invalid Version: hello world");
    }
  });

  it("should throw an error if the current version number is invalid", async () => {
    files.create("package.json", { version: "hello world" });

    try {
      let results = await versionBump({
        release: "major",
        cwd: "test/.tmp",
      });

      throw new Error(
        "An error should have been thrown, but results were returned:\n" +
        JSON.stringify(results, null, 2)
      );
    }
    catch (error) {
      expect(error).to.be.an.instanceOf(Error);
      error.message.should.equal(
        "Unable to determine the current version number. " +
        "Checked package.json, package-lock.json."
      );

      // The CWD should not have changed
      expect(process.cwd()).to.equal(ORIGINAL_CWD);

      // The package.json file should not have changed
      expect(files.json("package.json")).to.deep.equal({ version: "hello world" });

      // Git and NPM should NOT have been called
      expect(mocks.git()).to.be.empty;
      expect(mocks.npm()).to.be.empty;
    }
  });

});
