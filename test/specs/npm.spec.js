"use strict";

const { check, files, mocks, bump } = require("../utils");
const { expect } = require("chai");

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

    let cli = bump("--major");

    expect(cli).to.have.stderr("");
    expect(cli).to.have.exitCode(0);

    expect(cli).to.have.stdout(
      `${check} Updated package.json to 2.0.0\n`
    );

    let npm = mocks.npm();
    expect(npm.length).to.equal(1);

    expect(npm[0].cmd).to.equal("npm run preversion");
    expect(npm[0].version).to.equal("1.0.0");
  });

  it("should run the version script after updating the version number", () => {
    files.create("package.json", {
      version: "1.0.0",
      scripts: {
        version: "echo hello world",
      },
    });

    let cli = bump("--major");

    expect(cli).to.have.stderr("");
    expect(cli).to.have.exitCode(0);

    expect(cli).to.have.stdout(
      `${check} Updated package.json to 2.0.0\n`
    );

    let npm = mocks.npm();
    expect(npm.length).to.equal(1);

    expect(npm[0].cmd).to.equal("npm run version");
    expect(npm[0].version).to.equal("2.0.0");
  });

  it("should run the postversion script after updating the version number", () => {
    files.create("package.json", {
      version: "1.0.0",
      scripts: {
        postversion: "echo hello world",
      },
    });

    let cli = bump("--major");

    expect(cli).to.have.stderr("");
    expect(cli).to.have.exitCode(0);

    expect(cli).to.have.stdout(
      `${check} Updated package.json to 2.0.0\n`
    );

    let npm = mocks.npm();
    expect(npm.length).to.equal(1);

    expect(npm[0].cmd).to.equal("npm run postversion");
    expect(npm[0].version).to.equal("2.0.0");
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

    let cli = bump("--major --commit --tag --push");

    expect(cli).to.have.stderr("");
    expect(cli).to.have.exitCode(0);

    expect(cli).to.have.stdout(
      `${check} Updated package.json to 2.0.0\n` +
      `${check} Git commit\n` +
      `${check} Git tag\n` +
      `${check} Git push\n`
    );

    let bin = mocks.all();
    expect(bin.length).to.equal(7);

    // The preversion script runs before anything
    expect(bin[0].cmd).to.equal("npm run preversion");
    expect(bin[0].version).to.equal("1.0.0");

    // The version script runs after the version has been updated,
    expect(bin[1].cmd).to.equal("npm run version");
    expect(bin[1].version).to.equal("2.0.0");

    // Git commit happens after the version has been updated
    expect(bin[2].cmd).to.equal('git commit package.json -m "release v2.0.0"');
    expect(bin[2].version).to.equal("2.0.0");

    // Git tag happens after the version has been updated
    expect(bin[3].cmd).to.equal("git tag -a v2.0.0 -m 2.0.0");
    expect(bin[3].version).to.equal("2.0.0");

    // The postversion script runs AFTER "git commit" and "git tag", but BEFORE "git push"
    expect(bin[4].cmd).to.equal("npm run postversion");
    expect(bin[4].version).to.equal("2.0.0");

    // Git push happens after everything else
    expect(bin[5].cmd).to.equal("git push");
    expect(bin[5].version).to.equal("2.0.0");

    expect(bin[6].cmd).to.equal("git push --tags");
    expect(bin[6].version).to.equal("2.0.0");
  });

});
