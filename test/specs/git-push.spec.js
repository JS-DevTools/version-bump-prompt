"use strict";

const mocks = require("../fixtures/mocks");
const files = require("../fixtures/files");
const check = require("../fixtures/check");
const chaiExec = require("chai-exec");

describe.skip("bump --push", () => {

  it("should commit and push to git", () => {
    files.create("package.json", { version: "1.0.0" });

    let bump = chaiExec("--major --push");

    bump.should.have.stderr("");
    bump.should.have.exitCode(0);

    bump.should.have.stdout(
      `${check} Updated package.json to 2.0.0\n` +
      `${check} Git commit\n` +
      `${check} Git push\n`
    );

    let git = mocks.git();
    git.length.should.equal(2);

    git[0].cmd.should.equal('git commit package.json -m "release v2.0.0"');
    git[1].cmd.should.equal("git push");
  });

  it("should push all files", () => {
    files.create("package.json", { version: "1.0.0" });

    let bump = chaiExec("--minor --push --all");

    bump.should.have.stderr("");
    bump.should.have.exitCode(0);

    bump.should.have.stdout(
      `${check} Updated package.json to 1.1.0\n` +
      `${check} Git commit\n` +
      `${check} Git push\n`
    );

    let git = mocks.git();
    git.length.should.equal(2);

    git[0].cmd.should.equal('git commit -a -m "release v1.1.0"');
    git[1].cmd.should.equal("git push");
  });

  it("should push git tags", () => {
    files.create("package.json", { version: "1.0.0" });

    let bump = chaiExec("--premajor --tag --push");

    bump.should.have.stderr("");
    bump.should.have.exitCode(0);

    bump.should.have.stdout(
      `${check} Updated package.json to 2.0.0-beta.0\n` +
      `${check} Git commit\n` +
      `${check} Git tag\n` +
      `${check} Git push\n`
    );

    let git = mocks.git();
    git.length.should.equal(4);

    git[0].cmd.should.equal('git commit package.json -m "release v2.0.0-beta.0"');
    git[1].cmd.should.equal("git tag -a v2.0.0-beta.0 -m 2.0.0-beta.0");
    git[2].cmd.should.equal("git push");
    git[3].cmd.should.equal("git push --tags");
  });
});
