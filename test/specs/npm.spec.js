"use strict";

const { check, files, mocks, bump } = require("../utils");
const { expect } = require("chai");

describe("npm version hooks", () => {

  it("should run the preversion script before updating the version number", () => {
    files.create("package.json", {
      version: "1.0.0",
      scripts: {
        preversion: "echo hello world",
      },
    });

    let cli = bump("major");

    expect(cli).to.have.stderr("");
    expect(cli).to.have.exitCode(0);

    expect(cli).to.have.stdout(
      `${check} Npm run preversion\n` +
      `${check} Updated package.json to 2.0.0\n`
    );

    let npm = mocks.npmDetails();
    expect(npm.length).to.equal(1);

    expect(npm[0].cmd).to.equal("npm run preversion --silent");
    expect(npm[0].version).to.equal("1.0.0");
  });

  it("should run the version script after updating the version number", () => {
    files.create("package.json", {
      version: "1.0.0",
      scripts: {
        version: "echo hello world",
      },
    });

    let cli = bump("major");

    expect(cli).to.have.stderr("");
    expect(cli).to.have.exitCode(0);

    expect(cli).to.have.stdout(
      `${check} Updated package.json to 2.0.0\n` +
      `${check} Npm run version\n`
    );

    let npm = mocks.npmDetails();
    expect(npm.length).to.equal(1);

    expect(npm[0].cmd).to.equal("npm run version --silent");
    expect(npm[0].version).to.equal("2.0.0");
  });

  it("should run the postversion script after updating the version number", () => {
    files.create("package.json", {
      version: "1.0.0",
      scripts: {
        postversion: "echo hello world",
      },
    });

    let cli = bump("major");

    expect(cli).to.have.stderr("");
    expect(cli).to.have.exitCode(0);

    expect(cli).to.have.stdout(
      `${check} Updated package.json to 2.0.0\n` +
      `${check} Npm run postversion\n`
    );

    let npm = mocks.npmDetails();
    expect(npm.length).to.equal(1);

    expect(npm[0].cmd).to.equal("npm run postversion --silent");
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

    let cli = bump("major --commit --tag --push");

    expect(cli).to.have.stderr("");
    expect(cli).to.have.exitCode(0);

    expect(cli).to.have.stdout(
      `${check} Npm run preversion\n` +
      `${check} Updated package.json to 2.0.0\n` +
      `${check} Npm run version\n` +
      `${check} Git commit\n` +
      `${check} Git tag\n` +
      `${check} Npm run postversion\n` +
      `${check} Git push\n`
    );

    let bin = mocks.all();
    expect(bin.length).to.equal(7);

    // The preversion script runs before anything
    expect(bin[0].cmd).to.equal("npm run preversion --silent");
    expect(bin[0].version).to.equal("1.0.0");

    // The version script runs after the version has been updated,
    expect(bin[1].cmd).to.equal("npm run version --silent");
    expect(bin[1].version).to.equal("2.0.0");

    // Git commit happens after the version has been updated
    expect(bin[2].cmd).to.equal('git commit --message "release v2.0.0" package.json');
    expect(bin[2].version).to.equal("2.0.0");

    // Git tag happens after the version has been updated
    expect(bin[3].cmd).to.equal('git tag --annotate --message "release v2.0.0" v2.0.0');
    expect(bin[3].version).to.equal("2.0.0");

    // The postversion script runs AFTER "git commit" and "git tag", but BEFORE "git push"
    expect(bin[4].cmd).to.equal("npm run postversion --silent");
    expect(bin[4].version).to.equal("2.0.0");

    // Git push happens after everything else
    expect(bin[5].cmd).to.equal("git push");
    expect(bin[5].version).to.equal("2.0.0");

    expect(bin[6].cmd).to.equal("git push --tags");
    expect(bin[6].version).to.equal("2.0.0");
  });

  it("should skip all version scripts when --ignore-scripts is used", () => {
    files.create("package.json", {
      version: "1.2.3",
      scripts: {
        preversion: "echo preversion",
        version: "echo version",
        postversion: "echo postversion",
      }
    });
    files.create("package-lock.json", { version: "1.2.3" });

    let cli = bump("major --ignore-scripts");

    expect(cli).to.have.stderr("");
    expect(cli).to.have.exitCode(0);

    expect(cli).to.have.stdout(
      `${check} Updated package.json to 2.0.0\n` +
      `${check} Updated package-lock.json to 2.0.0\n`
    );

    // NPM should not have been run at all
    let npm = mocks.npm();
    expect(npm.length).to.equal(0);
  });

});
