"use strict";

const { check, files, mocks } = require("../utils");
const { chaiExec, expect } = require("../utils/chai");

describe.skip("bump --tag", () => {

  it("should add a git tag", () => {
    files.create("package.json", { version: "1.0.0" });

    let bump = chaiExec("--major --commit --tag");

    expect(bump).to.have.stderr("");
    expect(bump).to.have.exitCode(0);

    bump.should.have.stdout(
      `${check} Updated package.json to 2.0.0\n` +
      `${check} Git commit\n` +
      `${check} Git tag\n`
    );

    let git = mocks.git();
    expect(git.length).to.equal(2);

    expect(git[0].cmd).to.equal('git commit package.json -m "release v2.0.0"');
    expect(git[1].cmd).to.equal("git tag -a v2.0.0 -m 2.0.0");
  });

  it("should add a git tag, even if --commit is not specified", () => {
    files.create("package.json", { version: "1.0.0" });

    let bump = chaiExec("--minor --tag");

    expect(bump).to.have.stderr("");
    expect(bump).to.have.exitCode(0);

    bump.should.have.stdout(
      `${check} Updated package.json to 1.1.0\n` +
      `${check} Git commit\n` +
      `${check} Git tag\n`
    );

    let git = mocks.git();
    expect(git.length).to.equal(2);

    expect(git[0].cmd).to.equal('git commit package.json -m "release v1.1.0"');
    expect(git[1].cmd).to.equal("git tag -a v1.1.0 -m 1.1.0");
  });

  it("should tag all files", () => {
    files.create("package.json", { version: "1.0.0" });

    let bump = chaiExec("--patch --tag --all");

    expect(bump).to.have.stderr("");
    expect(bump).to.have.exitCode(0);

    bump.should.have.stdout(
      `${check} Updated package.json to 1.0.1\n` +
      `${check} Git commit\n` +
      `${check} Git tag\n`
    );

    let git = mocks.git();
    expect(git.length).to.equal(2);

    expect(git[0].cmd).to.equal('git commit -a -m "release v1.0.1"');
    expect(git[1].cmd).to.equal("git tag -a v1.0.1 -m 1.0.1");
  });

  it("should push git tags", () => {
    files.create("package.json", { version: "1.0.0" });
    files.create("bower.json", { version: "1.0.0" });

    let bump = chaiExec("--premajor --tag --push");

    expect(bump).to.have.stderr("");
    expect(bump).to.have.exitCode(0);

    bump.should.have.stdout(
      `${check} Updated package.json to 2.0.0-beta.0\n` +
      `${check} Updated bower.json to 2.0.0-beta.0\n` +
      `${check} Git commit\n` +
      `${check} Git tag\n` +
      `${check} Git push\n`
    );

    let git = mocks.git();
    expect(git.length).to.equal(4);

    expect(git[0].cmd).to.equal('git commit package.json bower.json -m "release v2.0.0-beta.0"');
    expect(git[1].cmd).to.equal("git tag -a v2.0.0-beta.0 -m 2.0.0-beta.0");
    expect(git[2].cmd).to.equal("git push");
    expect(git[3].cmd).to.equal("git push --tags");
  });
});
