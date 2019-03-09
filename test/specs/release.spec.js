"use strict";

const { check, files, bump } = require("../utils");
const { expect } = require("chai");

describe.skip("bump [release]", () => {

  it("should increment an all-zero version number", () => {
    files.create("package.json", { version: "0.0.0" });

    let cli = bump("major");

    expect(cli).to.have.stderr("");
    expect(cli).to.have.exitCode(0);

    expect(cli).to.have.stdout(
      `${check} Updated package.json to 1.0.0\n`
    );

    expect(files.json("package.json")).to.deep.equal({ version: "1.0.0" });
  });

  it("should reset the minor and patch", () => {
    files.create("package.json", { version: "1.2.3" });

    let cli = bump("--major");

    expect(cli).to.have.stderr("");
    expect(cli).to.have.exitCode(0);

    expect(cli).to.have.stdout(
      `${check} Updated package.json to 2.0.0\n`
    );

    expect(files.json("package.json")).to.deep.equal({ version: "2.0.0" });
  });

  it("should reset the prerelease version", () => {
    files.create("package.json", { version: "1.2.3-beta.4" });

    let cli = bump("--major");

    expect(cli).to.have.stderr("");
    expect(cli).to.have.exitCode(0);

    expect(cli).to.have.stdout(
      `${check} Updated package.json to 2.0.0\n`
    );

    expect(files.json("package.json")).to.deep.equal({ version: "2.0.0" });
  });

  it("should not be affected by the --preid flag", () => {
    files.create("package.json", { version: "1.2.3-beta.4" });

    let cli = bump("--major --preid alpha");

    expect(cli).to.have.stderr("");
    expect(cli).to.have.exitCode(0);

    expect(cli).to.have.stdout(
      `${check} Updated package.json to 2.0.0\n`
    );

    expect(files.json("package.json")).to.deep.equal({ version: "2.0.0" });
  });

  it("should error if there's no current version number", () => {
    files.create("package.json", {});

    let cli = bump("major");

    expect(cli).to.have.stdout("");
    expect(cli).to.have.exitCode(2);

    expect(cli).to.have.stderr(
      "Unable to determine the current version number. Checked package.json, package-lock.json.\n"
    );

    expect(files.json("package.json")).to.deep.equal({});
  });

  it("should print a more detailed error if DEBUG is set", () => {
    files.create("package.json", { version: "" });

    let cli = bump("major", { env: { DEBUG: "true" }});

    expect(cli).to.have.stdout("");
    expect(cli).to.have.exitCode(2);

    expect(cli).to.have.stderr.that.matches(
      /^Error: Unable to determine the current version number. Checked package.json, package-lock.json.\n\s+at \w+/
    );

    expect(files.json("package.json")).to.deep.equal({});
  });

});
