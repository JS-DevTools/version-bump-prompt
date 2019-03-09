"use strict";

const { check, files, mocks, bump } = require("../utils");
const { expect } = require("chai");

describe.skip("bump --commit", () => {

  it("should commit the manifest file to git", () => {
    files.create("package.json", { version: "1.0.0" });

    let cli = bump("--major --commit");

    expect(cli).to.have.stderr("");
    expect(cli).to.have.exitCode(0);

    expect(cli).to.have.stdout(
      `${check} Updated package.json to 2.0.0\n` +
      `${check} Git commit\n`
    );

    let git = mocks.git();
    expect(git.length).to.equal(1);

    expect(git[0].cmd).to.equal('git commit package.json -m "release v2.0.0"');
  });

  it("should commit multiple manifest files to git", () => {
    files.create("package.json", { version: "1.0.0" });
    files.create("bower.json", { version: "1.0.0" });
    files.create("component.json", { version: "1.0.0" });

    let cli = bump("--minor --commit");

    expect(cli).to.have.stderr("");
    expect(cli).to.have.exitCode(0);

    expect(cli).to.have.stdout(
      `${check} Updated package.json to 1.1.0\n` +
      `${check} Updated bower.json to 1.1.0\n` +
      `${check} Updated component.json to 1.1.0\n` +
      `${check} Git commit\n`
    );

    let git = mocks.git();
    expect(git.length).to.equal(1);

    expect(git[0].cmd).to.equal('git commit package.json bower.json component.json -m "release v1.1.0"');
  });

  it("should commit all files to git", () => {
    files.create("package.json", { version: "1.0.0" });

    let cli = bump("--minor --commit --all");

    expect(cli).to.have.stderr("");
    expect(cli).to.have.exitCode(0);

    expect(cli).to.have.stdout(
      `${check} Updated package.json to 1.1.0\n` +
      `${check} Git commit\n`
    );

    let git = mocks.git();
    expect(git.length).to.equal(1);

    expect(git[0].cmd).to.equal('git commit -a -m "release v1.1.0"');
  });

  it("should commit without running pre-commit hooks", () => {
    files.create("package.json", { version: "1.0.0" });

    let cli = bump("--minor --commit --all --no-verify");

    expect(cli.stderr).to.be.empty;
    expect(cli).to.have.exitCode(0);

    expect(cli).to.have.stdout(
      `${check} Updated package.json to 1.1.0\n` +
      `${check} Git commit\n`
    );

    let git = mocks.git();
    expect(git.length).to.equal(1);

    expect(git[0].cmd).to.equal('git commit --no-verify -a -m "release v1.1.0"');
  });

  it("should commit the manifest files to git with a message", () => {
    files.create("package.json", { version: "1.0.0" });

    let cli = bump("--patch --all --commit my-message");

    expect(cli).to.have.stderr("");
    expect(cli).to.have.exitCode(0);

    expect(cli).to.have.stdout(
      `${check} Updated package.json to 1.0.1\n` +
      `${check} Git commit\n`
    );

    let git = mocks.git();
    expect(git.length).to.equal(1);

    expect(git[0].cmd).to.equal('git commit -a -m "v1.0.1 my-message"');
  });

});
