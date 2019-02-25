"use strict";

const files = require("../utils/files");
const check = require("../utils/check");
const chaiExec = require("chai-exec");

describe.skip("bump --patch", () => {
  it("should not increment a non-existent version number", () => {
    files.create("package.json", {});
    files.create("bower.json", { name: "my-app" });

    let bump = chaiExec("--patch");

    bump.should.have.stderr("");
    bump.should.have.stdout("");
    bump.should.have.exitCode(0);

    files.json("package.json").should.deep.equal({});
    files.json("bower.json").should.deep.equal({ name: "my-app" });
  });

  it("should treat empty version numbers as 0.0.0", () => {
    files.create("package.json", { version: "" });
    files.create("bower.json", { version: null });
    files.create("component.json", { version: 0 });

    let bump = chaiExec("--patch");

    bump.should.have.stderr("");
    bump.should.have.exitCode(0);

    bump.should.have.stdout(
      `${check} Updated package.json to 0.0.1\n` +
      `${check} Updated bower.json to 0.0.1\n` +
      `${check} Updated component.json to 0.0.1\n`
    );

    files.json("package.json").should.deep.equal({ version: "0.0.1" });
    files.json("bower.json").should.deep.equal({ version: "0.0.1" });
    files.json("component.json").should.deep.equal({ version: "0.0.1" });
  });

  it("should increment an all-zero version number", () => {
    files.create("package.json", { version: "0.0.0" });

    let bump = chaiExec("--patch");

    bump.should.have.stderr("");
    bump.should.have.exitCode(0);

    bump.should.have.stdout(
      `${check} Updated package.json to 0.0.1\n`
    );

    files.json("package.json").should.deep.equal({ version: "0.0.1" });
  });

  it("should increment the patch", () => {
    files.create("package.json", { version: "1.2.3" });

    let bump = chaiExec("--patch");

    bump.should.have.stderr("");
    bump.should.have.exitCode(0);

    bump.should.have.stdout(
      `${check} Updated package.json to 1.2.4\n`
    );

    files.json("package.json").should.deep.equal({ version: "1.2.4" });
  });

  it("should reset the prerelease version", () => {
    files.create("package.json", { version: "1.2.3-beta.4" });

    let bump = chaiExec("--patch");

    bump.should.have.stderr("");
    bump.should.have.exitCode(0);

    bump.should.have.stdout(
      `${check} Updated package.json to 1.2.3\n`
    );

    files.json("package.json").should.deep.equal({ version: "1.2.3" });
  });

  it("should not be affected by the --preid flag", () => {
    files.create("package.json", { version: "1.2.3-beta.4" });

    let bump = chaiExec("--patch --preid alpha");

    bump.should.have.stderr("");
    bump.should.have.exitCode(0);

    bump.should.have.stdout(
      `${check} Updated package.json to 1.2.3\n`
    );

    files.json("package.json").should.deep.equal({ version: "1.2.3" });
  });
});
