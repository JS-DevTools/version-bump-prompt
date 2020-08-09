"use strict";

const { check, info, files, fixtures, bump } = require("../utils");
const { expect } = require("chai");

describe("bump [files...]", () => {

  it("should update the package.json and package-lock.json by default", () => {
    files.create("package.json", { version: "1.2.3" });
    files.create("package-lock.json", { version: "1.2.3" });

    let cli = bump("major");

    expect(cli).to.have.stderr("");
    expect(cli).to.have.exitCode(0);

    expect(cli).to.have.stdout(
      `${check} Updated package.json to 2.0.0\n` +
      `${check} Updated package-lock.json to 2.0.0\n`
    );

    expect(files.json("package.json")).to.deep.equal({ version: "2.0.0" });
    expect(files.json("package-lock.json")).to.deep.equal({ version: "2.0.0" });
  });

  it("should not update package-lock.json if package.json is explicitly specified", () => {
    files.create("package.json", { version: "1.2.3" });
    files.create("package-lock.json", { version: "1.2.3" });

    let cli = bump("major package.json");

    expect(cli).to.have.stderr("");
    expect(cli).to.have.exitCode(0);

    expect(cli).to.have.stdout(
      `${check} Updated package.json to 2.0.0\n`
    );

    expect(files.json("package.json")).to.deep.equal({ version: "2.0.0" });
    expect(files.json("package-lock.json")).to.deep.equal({ version: "1.2.3" });
  });

  it("should not update package.json if package-lock.json is explicitly specified", () => {
    files.create("package.json", { version: "1.2.3" });
    files.create("package-lock.json", { version: "1.2.3" });

    let cli = bump("major package-lock.json");

    expect(cli).to.have.stderr("");
    expect(cli).to.have.exitCode(0);

    expect(cli).to.have.stdout(
      `${check} Updated package-lock.json to 2.0.0\n`
    );

    expect(files.json("package.json")).to.deep.equal({ version: "1.2.3" });
    expect(files.json("package-lock.json")).to.deep.equal({ version: "2.0.0" });
  });

  it("should not update package.json or package-lock.json if another file is explicitly specified", () => {
    files.create("package.json", { version: "1.2.3" });
    files.create("package-lock.json", { version: "1.2.3" });
    files.create("bower.json", { version: "1.2.3" });

    let cli = bump("major bower.json");

    expect(cli).to.have.stderr("");
    expect(cli).to.have.exitCode(0);

    expect(cli).to.have.stdout(
      `${check} Updated bower.json to 2.0.0\n`
    );

    expect(files.json("package.json")).to.deep.equal({ version: "1.2.3" });
    expect(files.json("package-lock.json")).to.deep.equal({ version: "1.2.3" });
    expect(files.json("bower.json")).to.deep.equal({ version: "2.0.0" });
  });

  it("should replace the version number in non-manifest files", () => {
    files.create("package.json", { version: "1.2.3" });
    files.create("LICENSE", fixtures.license);
    files.create("README.md", fixtures.readme);
    files.create("script1.js", fixtures.script1);
    files.create("script2.js", fixtures.script2);
    files.create("subdir/deep/script1.js", fixtures.script1);
    files.create("subdir/deep/script2.js", fixtures.script2);

    let cli = bump("major LICENSE README.* **/*.js");

    expect(cli).to.have.stderr("");
    expect(cli).to.have.exitCode(0);

    expect(cli).to.have.stdout(
      `${check} Updated LICENSE to 2.0.0\n` +
      `${check} Updated README.md to 2.0.0\n` +
      `${check} Updated script1.js to 2.0.0\n` +
      `${info} script2.js did not need to be updated\n` +
      `${check} Updated subdir/deep/script1.js to 2.0.0\n` +
      `${info} subdir/deep/script2.js did not need to be updated\n`
    );

    expect(files.json("package.json")).to.deep.equal({ version: "1.2.3" });
    expect(files.text("LICENSE")).to.match(/MyApp v2.0.0 Copyright/);
    expect(files.text("README.md")).to.match(/version 2.0.0 and v2.0.0 should both get updated/);
    expect(files.text("script1.js")).to.match(/make sure v2.0.0 gets replaced/);
    expect(files.text("script1.js")).to.match(/let version = "2.0.0";/);
    expect(files.text("script2.js")).to.match(/version 3.2.1 and v8.9.10 don't match the old version number/);
    expect(files.text("subdir/deep/script1.js")).to.match(/make sure v2.0.0 gets replaced/);
    expect(files.text("subdir/deep/script1.js")).to.match(/let version = "2.0.0";/);
    expect(files.text("subdir/deep/script2.js")).to.match(/version 3.2.1 and v8.9.10 don't match the old version number/);
  });

  it("should not replace other version fields in manifest files", () => {
    files.create("package.json", { version: "1.2.3", notTheVersion: "1.2.3" });
    files.create("package-lock.json", { version: "1.2.3", notTheVersion: "1.2.3" });

    let cli = bump("major");

    expect(cli).to.have.stderr("");
    expect(cli).to.have.exitCode(0);

    expect(cli).to.have.stdout(
      `${check} Updated package.json to 2.0.0\n` +
      `${check} Updated package-lock.json to 2.0.0\n`
    );

    expect(files.json("package.json")).to.deep.equal({ version: "2.0.0", notTheVersion: "1.2.3" });
    expect(files.json("package-lock.json")).to.deep.equal({ version: "2.0.0", notTheVersion: "1.2.3" });
  });

  it("should not replace other version numbers in non-manifest files", () => {
    files.create("package.json", { version: "1.2.3" });
    files.create("LICENSE", fixtures.license);
    files.create("README.md", fixtures.readme);
    files.create("script1.js", fixtures.script1);
    files.create("script2.js", fixtures.script2);

    let cli = bump("major LICENSE README.* *.js");

    expect(cli).to.have.stderr("");
    expect(cli).to.have.exitCode(0);

    expect(cli).to.have.stdout(
      `${check} Updated LICENSE to 2.0.0\n` +
      `${check} Updated README.md to 2.0.0\n` +
      `${check} Updated script1.js to 2.0.0\n` +
      `${info} script2.js did not need to be updated\n`
    );

    expect(files.text("LICENSE")).to.match(/MyApp v2.0.0 Copyright/);
    expect(files.text("README.md")).to.match(/version 5.6.7 and v8.9.10 should not be changed/);
    expect(files.text("script2.js")).to.match(/version 3.2.1 and v8.9.10 don't match the old version number/);
  });

  it("should not not modify non-manifest files that don't contain the old version number", () => {
    files.create("package.json", { version: "4.5.6" });
    files.create("LICENSE", fixtures.license);
    files.create("README.md", fixtures.readme);
    files.create("script1.js", fixtures.script1);
    files.create("script2.js", fixtures.script2);

    let cli = bump("major LICENSE README.* *.js");

    expect(cli).to.have.stderr("");
    expect(cli).to.have.exitCode(0);

    expect(cli).to.have.stdout(
      `${info} LICENSE did not need to be updated\n` +
      `${info} README.md did not need to be updated\n` +
      `${info} script1.js did not need to be updated\n` +
      `${info} script2.js did not need to be updated\n`
    );

    expect(files.json("package.json")).to.deep.equal({ version: "4.5.6" });
    expect(files.text("LICENSE")).to.match(/MyApp v1.2.3 Copyright/);
    expect(files.text("README.md")).to.match(/version 5.6.7 and v8.9.10 should not be changed/);
    expect(files.text("README.md")).to.match(/version 1.2.3 and v1.2.3 should both get updated/);
    expect(files.text("script1.js")).to.match(/make sure v1.2.3 gets replaced/);
    expect(files.text("script1.js")).to.match(/let version = "1.2.3";/);
    expect(files.text("script1.js")).to.match(/let version = "1.2.3";/);
    expect(files.text("script2.js")).to.match(/version 3.2.1 and v8.9.10 don't match the old version number/);
  });

  it("should error if an explicitly-specified file doesn't exist", () => {
    files.create("package.json", { version: "1.2.3" });

    let cli = bump("major README.md");

    expect(cli).to.have.stderr("Could not find file: README.md.\n");
    expect(cli).to.have.exitCode(1);

    expect(files.json("package.json")).to.deep.equal({ version: "1.2.3" });
  });

  it("should error if a glob pattern doesn't match any files", () => {
    files.create("package.json", { version: "1.2.3" });

    let cli = bump("major **/*.js");

    expect(cli).to.have.stderr('Could not find any files matching "**/*.js".\n');
    expect(cli).to.have.exitCode(1);

    expect(files.json("package.json")).to.deep.equal({ version: "1.2.3" });
  });
});
