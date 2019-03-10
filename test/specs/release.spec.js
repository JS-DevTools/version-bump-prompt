"use strict";

const { check, files, bump } = require("../utils");
const { expect } = require("chai");

describe("bump [version]", () => {

  it("should accept an #.#.# version number", () => {
    files.create("package.json", { version: "1.0.0" });

    let cli = bump("123.45.678");

    expect(cli).to.have.stderr("");
    expect(cli).to.have.exitCode(0);

    expect(cli).to.have.stdout(
      `${check} Updated package.json to 123.45.678\n`
    );

    expect(files.json("package.json")).to.deep.equal({ version: "123.45.678" });
  });

  it("should accept an #.#.# version number that's all zeroes", () => {
    files.create("package.json", { version: "1.0.0" });

    let cli = bump("0.0.0");

    expect(cli).to.have.stderr("");
    expect(cli).to.have.exitCode(0);

    expect(cli).to.have.stdout(
      `${check} Updated package.json to 0.0.0\n`
    );

    expect(files.json("package.json")).to.deep.equal({ version: "0.0.0" });
  });

  it("should accept an #.#.#-X version number", () => {
    files.create("package.json", { version: "1.0.0" });

    let cli = bump("123.45.678-beta");

    expect(cli).to.have.stderr("");
    expect(cli).to.have.exitCode(0);

    expect(cli).to.have.stdout(
      `${check} Updated package.json to 123.45.678-beta\n`
    );

    expect(files.json("package.json")).to.deep.equal({ version: "123.45.678-beta" });
  });

  it("should accept an #.#.#-# version number", () => {
    files.create("package.json", { version: "1.0.0" });

    let cli = bump("123.45.678-910");

    expect(cli).to.have.stderr("");
    expect(cli).to.have.exitCode(0);

    expect(cli).to.have.stdout(
      `${check} Updated package.json to 123.45.678-910\n`
    );

    expect(files.json("package.json")).to.deep.equal({ version: "123.45.678-910" });
  });

  it("should accept an #.#.#-X.# version number", () => {
    files.create("package.json", { version: "1.0.0" });

    let cli = bump("123.45.678-beta.910");

    expect(cli).to.have.stderr("");
    expect(cli).to.have.exitCode(0);

    expect(cli).to.have.stdout(
      `${check} Updated package.json to 123.45.678-beta.910\n`
    );

    expect(files.json("package.json")).to.deep.equal({ version: "123.45.678-beta.910" });
  });

  it("should accept an #.#.#-#.# version number", () => {
    files.create("package.json", { version: "1.0.0" });

    let cli = bump("123.45.678-987.654");

    expect(cli).to.have.stderr("");
    expect(cli).to.have.exitCode(0);

    expect(cli).to.have.stdout(
      `${check} Updated package.json to 123.45.678-987.654\n`
    );

    expect(files.json("package.json")).to.deep.equal({ version: "123.45.678-987.654" });
  });

  it("should accept an #.#.#-X.X version number", () => {
    files.create("package.json", { version: "1.0.0" });

    let cli = bump("123.45.678-alpha.beta");

    expect(cli).to.have.stderr("");
    expect(cli).to.have.exitCode(0);

    expect(cli).to.have.stdout(
      `${check} Updated package.json to 123.45.678-alpha.beta\n`
    );

    expect(files.json("package.json")).to.deep.equal({ version: "123.45.678-alpha.beta" });
  });

  it("should not be affected by the --preid flag", () => {
    files.create("package.json", { version: "1.0.0" });

    let cli = bump("1.2.3-beta.1 --preid alpha");

    expect(cli).to.have.stderr("");
    expect(cli).to.have.exitCode(0);

    expect(cli).to.have.stdout(
      `${check} Updated package.json to 1.2.3-beta.1\n`
    );

    expect(files.json("package.json")).to.deep.equal({ version: "1.2.3-beta.1" });
  });

  it("should error if there's no current version number", () => {
    files.create("package.json", { version: "" });

    let cli = bump("1.2.3");

    expect(cli).to.have.stdout("");
    expect(cli).to.have.exitCode(1);
    expect(cli).to.have.stderr("Unable to determine the current version number. Checked package.json.\n");

    expect(files.json("package.json")).to.deep.equal({ version: "" });
  });

  it("should error on an X.X.X version number", () => {
    files.create("package.json", { version: "1.0.0" });

    let cli = bump("A.B.C");

    expect(cli).to.have.stdout("");
    expect(cli).to.have.stderr("Could not find file: A.B.C.\n");
    expect(cli).to.have.exitCode(1);

    expect(files.json("package.json")).to.deep.equal({ version: "1.0.0" });
  });

});
