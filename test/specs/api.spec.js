"use strict";

const versionBump = require("../../");
const { files, mocks } = require("../utils");
const { expect } = require("chai");

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

    expect(results).to.deep.equal({
      release: undefined,
      oldVersion: "1.0.0",
      newVersion: "2.34.567",
      commit: false,
      tag: false,
      updatedFiles: ["package.json"],
      skippedFiles: [],
    });

    // The package.json file should have been updated
    expect(files.json("package.json")).to.deep.equal({ version: "2.34.567" });

    // Git and NPM should NOT have been called
    expect(mocks.git()).to.have.lengthOf(0);
    expect(mocks.npm()).to.have.lengthOf(0);
  });

  it("should accept a bump type", async () => {
    files.create("package.json", { version: "1.0.0" });

    // Change the cwd, since we're not setting the `cwd` option
    process.chdir("test/.tmp");

    let results = await versionBump("minor");

    expect(results).to.deep.equal({
      release: "minor",
      oldVersion: "1.0.0",
      newVersion: "1.1.0",
      commit: false,
      tag: false,
      updatedFiles: ["package.json"],
      skippedFiles: [],
    });

    // The package.json file should have been updated
    expect(files.json("package.json")).to.deep.equal({ version: "1.1.0" });

    // Git and NPM should NOT have been called
    expect(mocks.git()).to.have.lengthOf(0);
    expect(mocks.npm()).to.have.lengthOf(0);
  });

  it("should accept options", async () => {
    files.create("package.json", { version: "1.0.0" });
    files.create("README.md", "The latest release is v1.0.0\n");
    files.create("subdir/deep/changelog.md", "# Changelog\n\n## v1.0.0\n\n## v0.0.1\n");
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
      ],
    });

    expect(results).to.deep.equal({
      release: "preminor",
      oldVersion: "1.0.0",
      newVersion: "1.1.0-test.1",
      commit: "A test of the upcoming v1.1.0-test.1",
      tag: "1.1.0-test.1",
      updatedFiles: [
        "random-file.json",
        "README.md",
        "subdir/deep/changelog.md"
      ],
      skippedFiles: [],
    });

    // The CWD should not have changed
    expect(process.cwd()).to.equal(ORIGINAL_CWD);

    // The package.json file should NOT have been updated, because it wasn't in the `files` list
    expect(files.json("package.json")).to.deep.equal({ version: "1.0.0" });

    // The other files should have been updated
    files.text("README.md", "The latest release is v1.1.0-test.1\n");

    files.text("subdir/deep/changelog.md", "# Changelog\n\n## v1.1.0-test.1\n\n## v0.0.1\n");

    expect(files.json("random-file.json")).to.deep.equal({
      name: "v1.1.0-test.1",
      version: "1.1.0-test.1",
      desc: "This is version 1.1.0-test.1.",
    });

    // A git commit and tag should have been created
    expect(mocks.git()).to.deep.equal([
      'git commit --message "A test of the upcoming v1.1.0-test.1" random-file.json README.md subdir/deep/changelog.md',
      'git tag --annotate --message "A test of the upcoming v1.1.0-test.1" 1.1.0-test.1',
    ]);

    // NPM should NOT have been called
    expect(mocks.npm()).to.have.lengthOf(0);
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
      expect(error.message).to.equal(
        "Unable to determine the current version number. Checked package.json."
      );

      // The CWD should not have changed
      expect(process.cwd()).to.equal(ORIGINAL_CWD);

      // The package.json file should not have changed
      expect(files.json("package.json")).to.deep.equal({ version: "hello world" });

      // Git and NPM should NOT have been called
      expect(mocks.git()).to.have.lengthOf(0);
      expect(mocks.npm()).to.have.lengthOf(0);
    }
  });

});
