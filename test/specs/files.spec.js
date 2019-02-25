"use strict";

const { check, files } = require("../utils");
const { chaiExec, expect } = require("../utils/chai");

describe.skip("bump [files...]", () => {

  it("should replace the version number in non-manifest files", () => {
    files.create("package.json", { version: "1.2.3" });
    files.copy("LICENSE");
    files.copy("README.md");
    files.copy("script1.js");
    files.copy("script2.js");

    let bump = chaiExec("--major --grep LICENSE README.* *.js");

    expect(bump).to.have.stderr("");
    expect(bump).to.have.exitCode(0);

    bump.should.have.stdout(
      `${check} Updated package.json to 2.0.0\n` +
      `${check} Updated README.md to 2.0.0\n` +
      `${check} Updated script1.js to 2.0.0\n` +
      `${check} Updated LICENSE to 2.0.0\n`
    );

    expect(files.json("package.json").version).to.equal("2.0.0");
    expect(files.text("LICENSE")).to.match(/MyApp v2.0.0 Copyright/);
    expect(files.text("README.md")).to.match(/version 2.0.0 and v2.0.0 should both get updated/);
    expect(files.text("script1.js")).to.match(/make sure v2.0.0 gets replaced correctly/);
    expect(files.text("script1.js")).to.match(/let version = "2.0.0";/);
    expect(files.text("script1.js")).to.match(/let version = "2.0.0";/);
  });

  it("should not replace other version numbers in non-manifest files", () => {
    files.create("package.json", { version: "1.2.3" });
    files.copy("LICENSE");
    files.copy("README.md");
    files.copy("script1.js");
    files.copy("script2.js");

    let bump = chaiExec("--major --grep LICENSE README.* *.js");

    expect(bump).to.have.stderr("");
    expect(bump).to.have.exitCode(0);

    bump.should.have.stdout(
      `${check} Updated package.json to 2.0.0\n` +
      `${check} Updated README.md to 2.0.0\n` +
      `${check} Updated script1.js to 2.0.0\n` +
      `${check} Updated LICENSE to 2.0.0\n`
    );

    expect(files.text("README.md")).to.match(/version 5.6.7 and v8.9.10 should not be changed/);
    expect(files.text("script2.js")).to.match(/version 3.2.1 and v8.9.10 don't match the old version number/);
  });

  it("should not not modify non-manifest files that don't contain the old version number", () => {
    files.create("package.json", { version: "4.5.6" });
    files.copy("LICENSE");
    files.copy("README.md");
    files.copy("script1.js");
    files.copy("script2.js");

    let bump = chaiExec("--major --grep LICENSE README.* *.js");

    expect(bump).to.have.stderr("");
    expect(bump).to.have.exitCode(0);

    bump.should.have.stdout(
      `${check} Updated package.json to 5.0.0\n`
    );

    expect(files.json("package.json").version).to.equal("5.0.0");
    expect(files.text("LICENSE")).to.match(/MyApp v1.2.3 Copyright/);
    expect(files.text("README.md")).to.match(/version 5.6.7 and v8.9.10 should not be changed/);
    expect(files.text("README.md")).to.match(/version 1.2.3 and v1.2.3 should both get updated/);
    expect(files.text("script1.js")).to.match(/make sure v1.2.3 gets replaced correctly/);
    expect(files.text("script1.js")).to.match(/let version = "1.2.3";/);
    expect(files.text("script1.js")).to.match(/let version = "1.2.3";/);
    expect(files.text("script2.js")).to.match(/version 3.2.1 and v8.9.10 don't match the old version number/);
  });

});
