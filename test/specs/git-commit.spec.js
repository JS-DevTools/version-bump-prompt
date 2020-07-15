"use strict";

const { check, files, mocks, bump } = require("../utils");
const { expect } = require("chai");

describe("bump --commit", () => {

  it("should not commit by default", () => {
    files.create("package.json", { version: "1.0.0" });

    let cli = bump("major");

    expect(cli).to.have.stderr("");
    expect(cli).to.have.exitCode(0);

    expect(cli).to.have.stdout(
      `${check} Updated package.json to 2.0.0\n`
    );

    let git = mocks.git();
    expect(git.length).to.equal(0);
  });

  it("should commit the manifest file to git", () => {
    files.create("package.json", { version: "1.0.0" });

    let cli = bump("major --commit");

    expect(cli).to.have.stderr("");
    expect(cli).to.have.exitCode(0);

    expect(cli).to.have.stdout(
      `${check} Updated package.json to 2.0.0\n` +
      `${check} Git commit\n`
    );

    let git = mocks.git();
    expect(git.length).to.equal(1);
    expect(git[0]).to.equal('git commit --message "release v2.0.0" package.json');
  });

  it("should commit multiple manifest files to git", () => {
    files.create("package.json", { version: "1.0.0" });
    files.create("bower.json", { version: "1.0.0" });
    files.create("component.json", { version: "1.0.0" });

    let cli = bump("minor *.json --commit");

    expect(cli).to.have.stderr("");
    expect(cli).to.have.exitCode(0);

    expect(cli).to.have.stdout(
      `${check} Updated bower.json to 1.1.0\n` +
      `${check} Updated component.json to 1.1.0\n` +
      `${check} Updated package.json to 1.1.0\n` +
      `${check} Git commit\n`
    );

    let git = mocks.git();
    expect(git.length).to.equal(1);
    expect(git[0]).to.equal('git commit --message "release v1.1.0" bower.json component.json package.json');
  });

  it("should commit all files to git", () => {
    files.create("package.json", { version: "1.0.0" });

    let cli = bump("minor --commit --all");

    expect(cli).to.have.stderr("");
    expect(cli).to.have.exitCode(0);

    expect(cli).to.have.stdout(
      `${check} Updated package.json to 1.1.0\n` +
      `${check} Git commit\n`
    );

    let git = mocks.git();
    expect(git.length).to.equal(1);
    expect(git[0]).to.equal('git commit --all --message "release v1.1.0"');
  });

  it("should commit without running pre-commit hooks", () => {
    files.create("package.json", { version: "1.0.0" });

    let cli = bump("minor --commit --all --no-verify");

    expect(cli.stderr).to.have.lengthOf(0);
    expect(cli).to.have.exitCode(0);

    expect(cli).to.have.stdout(
      `${check} Updated package.json to 1.1.0\n` +
      `${check} Git commit\n`
    );

    let git = mocks.git();
    expect(git.length).to.equal(1);
    expect(git[0]).to.equal('git commit --all --no-verify --message "release v1.1.0"');
  });

  it("should append the version number to the commit message", () => {
    files.create("package.json", { version: "1.0.0" });

    let cli = bump('patch --all --commit "this is release v"');

    expect(cli).to.have.stderr("");
    expect(cli).to.have.exitCode(0);

    expect(cli).to.have.stdout(
      `${check} Updated package.json to 1.0.1\n` +
      `${check} Git commit\n`
    );

    let git = mocks.git();
    expect(git.length).to.equal(1);
    expect(git[0]).to.equal('git commit --all --message "this is release v1.0.1"');
  });

  it("should replace version number placeholders in the commit message", () => {
    files.create("package.json", { version: "1.0.0" });

    let cli = bump('patch --all --commit "Releasing v%s. This is release v%s."');

    expect(cli).to.have.stderr("");
    expect(cli).to.have.exitCode(0);

    expect(cli).to.have.stdout(
      `${check} Updated package.json to 1.0.1\n` +
      `${check} Git commit\n`
    );

    let git = mocks.git();
    expect(git.length).to.equal(1);
    expect(git[0]).to.equal('git commit --all --message "Releasing v1.0.1. This is release v1.0.1."');
  });

  it("should accept an empty commit message", () => {
    files.create("package.json", { version: "1.0.0" });

    let cli = bump(["patch", "--all", "--commit", ""]);

    expect(cli).to.have.stderr("");
    expect(cli).to.have.exitCode(0);

    expect(cli).to.have.stdout(
      `${check} Updated package.json to 1.0.1\n` +
      `${check} Git commit\n`
    );

    let git = mocks.git();
    expect(git.length).to.equal(1);

    expect(git[0]).to.equal("git commit --all --message 1.0.1");
  });

});
