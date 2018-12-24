"use strict";

const files = require("../fixtures/files");
const check = require("../fixtures/check");
const chaiExec = require("chai-exec");

describe("bump --lock", () => {
  it("should not increment lock file by default", () => {
    files.create("package-lock.json", { version: "1.0.0" });

    let bump = chaiExec("--patch");

    bump.stderr.should.be.empty;
    bump.stdout.should.be.empty;
    bump.should.have.exitCode(0);

    files.json("package-lock.json").should.deep.equal({ version: "1.0.0" });
  });

  it("should increment version when lock option is provided", () => {
    files.create("package-lock.json", { version: "0.0.0" });

    let bump = chaiExec("--patch --lock");

    bump.stderr.should.be.empty;
    bump.should.have.exitCode(0);

    bump.should.have.stdout(
      `${check} Updated package-lock.json to 0.0.1\n`
    );

    files.json("package-lock.json").should.deep.equal({ version: "0.0.1" });
  });
});
