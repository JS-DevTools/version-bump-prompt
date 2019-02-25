"use strict";

const { check, files, mocks } = require("../utils");
const { chaiExec, expect } = require("../utils/chai");

describe.skip("bump --push", () => {

  it("should commit and push to git", () => {
    files.create("package.json", { version: "1.0.0" });

    let bump = chaiExec("--major --push");

    expect(bump).to.have.stderr("");
    expect(bump).to.have.exitCode(0);

    bump.should.have.stdout(
      `${check} Updated package.json to 2.0.0\n` +
      `${check} Git commit\n` +
      `${check} Git push\n`
    );

    let git = mocks.git();
    expect(git.length).to.equal(2);

    expect(git[0].cmd).to.equal('git commit package.json -m "release v2.0.0"');
    expect(git[1].cmd).to.equal("git push");
  });

  it("should push all files", () => {
    files.create("package.json", { version: "1.0.0" });

    let bump = chaiExec("--minor --push --all");

    expect(bump).to.have.stderr("");
    expect(bump).to.have.exitCode(0);

    bump.should.have.stdout(
      `${check} Updated package.json to 1.1.0\n` +
      `${check} Git commit\n` +
      `${check} Git push\n`
    );

    let git = mocks.git();
    expect(git.length).to.equal(2);

    expect(git[0].cmd).to.equal('git commit -a -m "release v1.1.0"');
    expect(git[1].cmd).to.equal("git push");
  });

  it("should push git tags", () => {
    files.create("package.json", { version: "1.0.0" });

    let bump = chaiExec("--premajor --tag --push");

    expect(bump).to.have.stderr("");
    expect(bump).to.have.exitCode(0);

    bump.should.have.stdout(
      `${check} Updated package.json to 2.0.0-beta.0\n` +
      `${check} Git commit\n` +
      `${check} Git tag\n` +
      `${check} Git push\n`
    );

    let git = mocks.git();
    expect(git.length).to.equal(4);

    expect(git[0].cmd).to.equal('git commit package.json -m "release v2.0.0-beta.0"');
    expect(git[1].cmd).to.equal("git tag -a v2.0.0-beta.0 -m 2.0.0-beta.0");
    expect(git[2].cmd).to.equal("git push");
    expect(git[3].cmd).to.equal("git push --tags");
  });
});
