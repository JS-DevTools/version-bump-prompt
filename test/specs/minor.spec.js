"use strict";

const { check, files, bump } = require("../utils");
const { expect } = require("chai");

describe.skip("bump --minor", () => {
  it("should not increment a non-existent version number", () => {
    files.create("package.json", {});
    files.create("bower.json", { name: "my-app" });

    let cli = bump("--minor");

    expect(cli).to.have.stderr("");
    expect(cli).to.have.stdout("");
    expect(cli).to.have.exitCode(0);

    expect(files.json("package.json")).to.deep.equal({});
    expect(files.json("bower.json")).to.deep.equal({ name: "my-app" });
  });

  it("should treat empty version numbers as 0.0.0", () => {
    files.create("package.json", { version: "" });
    files.create("bower.json", { version: null });
    files.create("component.json", { version: 0 });

    let cli = bump("--minor");

    expect(cli).to.have.stderr("");
    expect(cli).to.have.exitCode(0);

    expect(cli).to.have.stdout(
      `${check} Updated package.json to 0.1.0\n` +
      `${check} Updated bower.json to 0.1.0\n` +
      `${check} Updated component.json to 0.1.0\n`
    );

    expect(files.json("package.json")).to.deep.equal({ version: "0.1.0" });
    expect(files.json("bower.json")).to.deep.equal({ version: "0.1.0" });
    expect(files.json("component.json")).to.deep.equal({ version: "0.1.0" });
  });

  it("should increment an all-zero version number", () => {
    files.create("package.json", { version: "0.0.0" });

    let cli = bump("--minor");

    expect(cli).to.have.stderr("");
    expect(cli).to.have.exitCode(0);

    expect(cli).to.have.stdout(
      `${check} Updated package.json to 0.1.0\n`
    );

    expect(files.json("package.json")).to.deep.equal({ version: "0.1.0" });
  });

  it("should reset the patch", () => {
    files.create("package.json", { version: "1.2.3" });

    let cli = bump("--minor");

    expect(cli).to.have.stderr("");
    expect(cli).to.have.exitCode(0);

    expect(cli).to.have.stdout(
      `${check} Updated package.json to 1.3.0\n`
    );

    expect(files.json("package.json")).to.deep.equal({ version: "1.3.0" });
  });

  it("should reset the prerelease version", () => {
    files.create("package.json", { version: "1.2.3-beta.4" });

    let cli = bump("--minor");

    expect(cli).to.have.stderr("");
    expect(cli).to.have.exitCode(0);

    expect(cli).to.have.stdout(
      `${check} Updated package.json to 1.3.0\n`
    );

    expect(files.json("package.json")).to.deep.equal({ version: "1.3.0" });
  });

  it("should not be affected by the --preid flag", () => {
    files.create("package.json", { version: "1.2.3-beta.4" });

    let cli = bump("--minor --preid alpha");

    expect(cli).to.have.stderr("");
    expect(cli).to.have.exitCode(0);

    expect(cli).to.have.stdout(
      `${check} Updated package.json to 1.3.0\n`
    );

    expect(files.json("package.json")).to.deep.equal({ version: "1.3.0" });
  });
});
