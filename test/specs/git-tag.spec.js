"use strict";

const { check, files, mocks, bump } = require("../utils");
const { expect } = require("chai");

describe("bump --tag", () => {

  it("should not tag by default", () => {
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

  it("should not tag by default, even if --commit is used", () => {
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

  it("should add a git tag", () => {
    files.create("package.json", { version: "1.0.0" });

    let cli = bump("major --commit --tag");

    expect(cli).to.have.stderr("");
    expect(cli).to.have.exitCode(0);

    expect(cli).to.have.stdout(
      `${check} Updated package.json to 2.0.0\n` +
      `${check} Git commit\n` +
      `${check} Git tag\n`
    );

    let git = mocks.git();
    expect(git.length).to.equal(2);

    expect(git[0]).to.equal('git commit --message "release v2.0.0" package.json');
    expect(git[1]).to.equal('git tag --annotate --message "release v2.0.0" v2.0.0');
  });

  it("should add a git tag, even if --commit is not specified", () => {
    files.create("package.json", { version: "1.0.0" });

    let cli = bump("minor --tag");

    expect(cli).to.have.stderr("");
    expect(cli).to.have.exitCode(0);

    expect(cli).to.have.stdout(
      `${check} Updated package.json to 1.1.0\n` +
      `${check} Git commit\n` +
      `${check} Git tag\n`
    );

    let git = mocks.git();
    expect(git.length).to.equal(2);

    expect(git[0]).to.equal('git commit --message "release v1.1.0" package.json');
    expect(git[1]).to.equal('git tag --annotate --message "release v1.1.0" v1.1.0');
  });

  it("should tag all files", () => {
    files.create("package.json", { version: "1.0.0" });

    let cli = bump("patch --tag --all");

    expect(cli).to.have.stderr("");
    expect(cli).to.have.exitCode(0);

    expect(cli).to.have.stdout(
      `${check} Updated package.json to 1.0.1\n` +
      `${check} Git commit\n` +
      `${check} Git tag\n`
    );

    let git = mocks.git();
    expect(git.length).to.equal(2);

    expect(git[0]).to.equal('git commit --all --message "release v1.0.1"');
    expect(git[1]).to.equal('git tag --annotate --message "release v1.0.1" v1.0.1');
  });

  it("should push git tags", () => {
    files.create("package.json", { version: "1.0.0" });
    files.create("bower.json", { version: "1.0.0" });

    let cli = bump("premajor --tag --push *.json");

    expect(cli).to.have.stderr("");
    expect(cli).to.have.exitCode(0);

    expect(cli).to.have.stdout(
      `${check} Updated bower.json to 2.0.0-beta.1\n` +
      `${check} Updated package.json to 2.0.0-beta.1\n` +
      `${check} Git commit\n` +
      `${check} Git tag\n` +
      `${check} Git push\n`
    );

    let git = mocks.git();
    expect(git.length).to.equal(4);

    expect(git[0]).to.equal('git commit --message "release v2.0.0-beta.1" bower.json package.json');
    expect(git[1]).to.equal('git tag --annotate --message "release v2.0.0-beta.1" v2.0.0-beta.1');
    expect(git[2]).to.equal("git push");
    expect(git[3]).to.equal("git push --tags");
  });
});
