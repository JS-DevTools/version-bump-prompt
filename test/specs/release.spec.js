"use strict";

const { check, files } = require("../utils");
const chaiExec = require("chai-exec");

describe.skip("bump [release]", () => {

  it("should increment an all-zero version number", () => {
    files.create("package.json", { version: "0.0.0" });

    let bump = chaiExec("major");

    bump.should.have.stderr("");
    bump.should.have.exitCode(0);

    bump.should.have.stdout(
      `${check} Updated package.json to 1.0.0\n`
    );

    files.json("package.json").should.deep.equal({ version: "1.0.0" });
  });

  it("should reset the minor and patch", () => {
    files.create("package.json", { version: "1.2.3" });

    let bump = chaiExec("--major");

    bump.should.have.stderr("");
    bump.should.have.exitCode(0);

    bump.should.have.stdout(
      `${check} Updated package.json to 2.0.0\n`
    );

    files.json("package.json").should.deep.equal({ version: "2.0.0" });
  });

  it("should reset the prerelease version", () => {
    files.create("package.json", { version: "1.2.3-beta.4" });

    let bump = chaiExec("--major");

    bump.should.have.stderr("");
    bump.should.have.exitCode(0);

    bump.should.have.stdout(
      `${check} Updated package.json to 2.0.0\n`
    );

    files.json("package.json").should.deep.equal({ version: "2.0.0" });
  });

  it("should not be affected by the --preid flag", () => {
    files.create("package.json", { version: "1.2.3-beta.4" });

    let bump = chaiExec("--major --preid alpha");

    bump.should.have.stderr("");
    bump.should.have.exitCode(0);

    bump.should.have.stdout(
      `${check} Updated package.json to 2.0.0\n`
    );

    files.json("package.json").should.deep.equal({ version: "2.0.0" });
  });

  it("should error if there's no current version number", () => {
    files.create("package.json", {});

    let bump = chaiExec("major");

    bump.should.have.stdout("");
    bump.should.have.exitCode(2);

    bump.should.have.stderr(
      "Unable to determine the current version number. Checked package.json, package-lock.json.\n"
    );

    files.json("package.json").should.deep.equal({});
  });

  it("should print a more detailed error if DEBUG is set", () => {
    files.create("package.json", { version: "" });

    let bump = chaiExec("major", { env: { DEBUG: "true" }});

    bump.should.have.stdout("");
    bump.should.have.exitCode(2);

    bump.should.have.stderr.that.matches(
      /^Error: Unable to determine the current version number. Checked package.json, package-lock.json.\n\s+at \w+/
    );

    files.json("package.json").should.deep.equal({});
  });

});
