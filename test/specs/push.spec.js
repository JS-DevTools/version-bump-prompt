"use strict";

const cli = require("../fixtures/cli");
const mocks = require("../fixtures/mocks");
const files = require("../fixtures/files");
const check = require("../fixtures/check");
const chai = require("chai");

chai.should();

describe("bump --push", () => {

  it("should commit and push to git", () => {
    files.create("package.json", { version: "1.0.0" });

    let output = cli.exec("--major --push");

    output.stderr.should.be.empty;
    output.status.should.equal(0);

    output.lines.should.deep.equal([
      `${check} Updated package.json to 2.0.0`,
      `${check} Git commit`,
      `${check} Git push`,
    ]);

    let git = mocks.git();
    git.length.should.equal(2);

    git[0].cmd.should.equal('git commit package.json -m "release v2.0.0"');
    git[1].cmd.should.equal("git push");
  });

  it("should push all files", () => {
    files.create("package.json", { version: "1.0.0" });

    let output = cli.exec("--minor --push --all");

    output.stderr.should.be.empty;
    output.status.should.equal(0);

    output.lines.should.deep.equal([
      `${check} Updated package.json to 1.1.0`,
      `${check} Git commit`,
      `${check} Git push`,
    ]);

    let git = mocks.git();
    git.length.should.equal(2);

    git[0].cmd.should.equal('git commit -a -m "release v1.1.0"');
    git[1].cmd.should.equal("git push");
  });

  it("should push git tags", () => {
    files.create("package.json", { version: "1.0.0" });

    let output = cli.exec("--premajor --tag --push");

    output.stderr.should.be.empty;
    output.status.should.equal(0);

    output.lines.should.deep.equal([
      `${check} Updated package.json to 2.0.0-beta.0`,
      `${check} Git commit`,
      `${check} Git tag`,
      `${check} Git push`,
    ]);

    let git = mocks.git();
    git.length.should.equal(4);

    git[0].cmd.should.equal('git commit package.json -m "release v2.0.0-beta.0"');
    git[1].cmd.should.equal("git tag -a v2.0.0-beta.0 -m 2.0.0-beta.0");
    git[2].cmd.should.equal("git push");
    git[3].cmd.should.equal("git push --tags");
  });
});
