"use strict";

const { check, files, mocks, bump } = require("../utils");
const { expect } = require("chai");

describe("bump --push", () => {

  it("should not push by default", () => {
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

  it("should not push by default, even if --commit or --tag is used", () => {
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

  it("should commit and push to git", () => {
    files.create("package.json", { version: "1.0.0" });

    let cli = bump("major --push");

    expect(cli).to.have.stderr("");
    expect(cli).to.have.exitCode(0);

    expect(cli).to.have.stdout(
      `${check} Updated package.json to 2.0.0\n` +
      `${check} Git commit\n` +
      `${check} Git push\n`
    );

    let git = mocks.git();
    expect(git.length).to.equal(2);

    expect(git[0]).to.equal('git commit --message "release v2.0.0" package.json');
    expect(git[1]).to.equal("git push");
  });

  it("should push all files", () => {
    files.create("package.json", { version: "1.0.0" });

    let cli = bump("minor --push --all");

    expect(cli).to.have.stderr("");
    expect(cli).to.have.exitCode(0);

    expect(cli).to.have.stdout(
      `${check} Updated package.json to 1.1.0\n` +
      `${check} Git commit\n` +
      `${check} Git push\n`
    );

    let git = mocks.git();
    expect(git.length).to.equal(2);

    expect(git[0]).to.equal('git commit --all --message "release v1.1.0"');
    expect(git[1]).to.equal("git push");
  });

  it("should push git tags", () => {
    files.create("package.json", { version: "1.0.0" });

    let cli = bump("premajor --tag --push");

    expect(cli).to.have.stderr("");
    expect(cli).to.have.exitCode(0);

    expect(cli).to.have.stdout(
      `${check} Updated package.json to 2.0.0-beta.1\n` +
      `${check} Git commit\n` +
      `${check} Git tag\n` +
      `${check} Git push\n`
    );

    let git = mocks.git();
    expect(git.length).to.equal(4);

    expect(git[0]).to.equal('git commit --message "release v2.0.0-beta.1" package.json');
    expect(git[1]).to.equal('git tag --annotate --message "release v2.0.0-beta.1" v2.0.0-beta.1');
    expect(git[2]).to.equal("git push");
    expect(git[3]).to.equal("git push --tags");
  });
});
