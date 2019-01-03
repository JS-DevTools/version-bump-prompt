"use strict";

const mocks = require("../fixtures/mocks");
const files = require("../fixtures/files");
const check = require("../fixtures/check");
const chaiExec = require("chai-exec");

describe.skip("npm version hooks", () => {
  if (process.platform === "win32" && process.env.CI) {
    // Spawning NPM fails on Windows due to a bug in NYC (actually in its dependency, spawn-wrap)
    // So skip these tests until this bug is fixed: https://github.com/istanbuljs/nyc/issues/760
    return;
  }

  it("should run the preversion script before updating the version number", () => {
    files.create("package.json", {
      version: "1.0.0",
      scripts: {
        preversion: "echo hello world",
      },
    });

    let bump = chaiExec("--major");

    bump.should.have.stderr("");
    bump.should.have.exitCode(0);

    bump.should.have.stdout(
      `${check} Updated package.json to 2.0.0\n`
    );

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

    let bump = chaiExec("--major");

    bump.should.have.stderr("");
    bump.should.have.exitCode(0);

    bump.should.have.stdout(
      `${check} Updated package.json to 2.0.0\n`
    );

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

    let bump = chaiExec("--major");

    bump.should.have.stderr("");
    bump.should.have.exitCode(0);

    bump.should.have.stdout(
      `${check} Updated package.json to 2.0.0\n`
    );

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

    let bump = chaiExec("--major --commit --tag --push");

    bump.should.have.stderr("");
    bump.should.have.exitCode(0);

    bump.should.have.stdout(
      `${check} Updated package.json to 2.0.0\n` +
      `${check} Git commit\n` +
      `${check} Git tag\n` +
      `${check} Git push\n`
    );

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
