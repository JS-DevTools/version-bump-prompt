"use strict";

const cli = require("../fixtures/cli");
const mocks = require("../fixtures/mocks");
const files = require("../fixtures/files");
const check = require("../fixtures/check");
const chai = require("chai");

chai.should();

describe("npm version hooks", () => {

  it("should run the preversion script before updating the version number", () => {
    files.create("package.json", {
      version: "1.0.0",
      scripts: {
        preversion: "echo hello world",
      },
    });

    let output = cli.exec("--major");

    output.stderr.should.be.empty;
    output.status.should.equal(0);

    output.lines.should.deep.equal([
      `${check} Updated package.json to 2.0.0`,
    ]);

    let npm = mocks.npm();
    npm.length.should.equal(1);

    npm[0].cmd.should.equal("npm run preversion");
    npm[0].version.should.equal("1.0.0");
  });

  it("should run the version script after updating the version number", () => {
    files.create("package.json", {
      version: "1.0.0",
      scripts: {
        version: "echo hello world",
      },
    });

    let output = cli.exec("--major");

    output.stderr.should.be.empty;
    output.status.should.equal(0);

    output.lines.should.deep.equal([
      `${check} Updated package.json to 2.0.0`,
    ]);

    let npm = mocks.npm();
    npm.length.should.equal(1);

    npm[0].cmd.should.equal("npm run version");
    npm[0].version.should.equal("2.0.0");
  });

  it("should run the postversion script after updating the version number", () => {
    files.create("package.json", {
      version: "1.0.0",
      scripts: {
        postversion: "echo hello world",
      },
    });

    let output = cli.exec("--major");

    output.stderr.should.be.empty;
    output.status.should.equal(0);

    output.lines.should.deep.equal([
      `${check} Updated package.json to 2.0.0`,
    ]);

    let npm = mocks.npm();
    npm.length.should.equal(1);

    npm[0].cmd.should.equal("npm run postversion");
    npm[0].version.should.equal("2.0.0");
  });

  it("should run all the version scripts and git commands in the correct order", () => {
    files.create("package.json", {
      version: "1.0.0",
      scripts: {
        preversion: "echo hello world",
        version: "echo hello world",
        postversion: "echo hello world",
      },
    });

    let output = cli.exec("--major --commit --tag --push");

    output.stderr.should.be.empty;
    output.status.should.equal(0);

    output.lines.should.deep.equal([
      `${check} Updated package.json to 2.0.0`,
      `${check} Git commit`,
      `${check} Git tag`,
      `${check} Git push`,
    ]);

    let bin = mocks.all();
    bin.length.should.equal(7);

    // The preversion script runs before anything
    bin[0].cmd.should.equal("npm run preversion");
    bin[0].version.should.equal("1.0.0");

    // The version script runs after the version has been updated,
    bin[1].cmd.should.equal("npm run version");
    bin[1].version.should.equal("2.0.0");

    // Git commit happens after the version has been updated
    bin[2].cmd.should.equal('git commit package.json -m "release v2.0.0"');
    bin[2].version.should.equal("2.0.0");

    // Git tag happens after the version has been updated
    bin[3].cmd.should.equal("git tag -a v2.0.0 -m 2.0.0");
    bin[3].version.should.equal("2.0.0");

    // The postversion script runs AFTER "git commit" and "git tag", but BEFORE "git push"
    bin[4].cmd.should.equal("npm run postversion");
    bin[4].version.should.equal("2.0.0");

    // Git push happens after everything else
    bin[5].cmd.should.equal("git push");
    bin[5].version.should.equal("2.0.0");

    bin[6].cmd.should.equal("git push --tags");
    bin[6].version.should.equal("2.0.0");
  });

});
