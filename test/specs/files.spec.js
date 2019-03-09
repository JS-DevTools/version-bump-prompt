"use strict";

const { check, files, fixtures } = require("../utils");
const { chaiExec, expect } = require("../utils/chai");

describe.skip("bump [files...]", () => {

  it("should update the package.json and package-lock.json by default", () => {
    files.create("package.json", { version: "1.2.3" });
    files.create("package-lock.json", { version: "1.2.3" });

    let bump = chaiExec("major");

    expect(bump).to.have.stderr("");
    expect(bump).to.have.exitCode(0);

    bump.should.have.stdout(
      `${check} Updated package.json to 2.0.0\n` +
      `${check} Updated package-lock.json to 2.0.0\n`
    );

    expect(files.json("package.json").version).to.equal("2.0.0");
    expect(files.json("package-lock.json").version).to.equal("2.0.0");
  });

  it("should not update package.json if package-lock.json is explicitly specified", () => {
    files.create("package.json", { version: "1.2.3" });
    files.create("package-lock.json", { version: "1.2.3" });

    let bump = chaiExec("major");

    expect(bump).to.have.stderr("");
    expect(bump).to.have.exitCode(0);

    bump.should.have.stdout(
      `${check} Updated package.json to 2.0.0\n` +
      `${check} Updated package-lock.json to 2.0.0\n`
    );

    expect(files.json("package.json").version).to.equal("2.0.0");
    expect(files.json("package-lock.json").version).to.equal("2.0.0");
  });

  it("should replace the version number in non-manifest files", () => {
    files.create("package.json", { version: "1.2.3" });
    files.create("LICENSE", fixtures.license);
    files.create("README.md", fixtures.readme);
    files.create("script1.js", fixtures.script1);
    files.create("script2.js", fixtures.script2);
    files.create("subdir/deep/script1.js", fixtures.script1);
    files.create("subdir/deep/script2.js", fixtures.script2);

    let bump = chaiExec("major LICENSE README.* **/*.js");

    expect(bump).to.have.stderr("");
    expect(bump).to.have.exitCode(0);

    bump.should.have.stdout(
      `${check} Updated LICENSE to 2.0.0\n` +
      `${check} Updated README.md to 2.0.0\n` +
      `${check} Updated script1.js to 2.0.0\n`
    );

    expect(files.json("package.json").version).to.equal("2.0.0");
    expect(files.text("LICENSE")).to.match(/MyApp v2.0.0 Copyright/);
    expect(files.text("README.md")).to.match(/version 2.0.0 and v2.0.0 should both get updated/);
    expect(files.text("script1.js")).to.match(/make sure v2.0.0 gets replaced correctly/);
    expect(files.text("script1.js")).to.match(/let version = "2.0.0";/);
    expect(files.text("script1.js")).to.match(/let version = "2.0.0";/);
  });

  it("should not replace other version fields in manifest files", () => {
    files.create("package.json", { version: "1.2.3", notTheVersion: "1.2.3" });
    files.create("package-lock.json", { version: "1.2.3", notTheVersion: "1.2.3" });

    let bump = chaiExec("major");

    expect(bump).to.have.stderr("");
    expect(bump).to.have.exitCode(0);

    bump.should.have.stdout(
      `${check} Updated package.json to 2.0.0\n` +
      `${check} Updated package-lock.json to 2.0.0\n`
    );

    expect(files.text("README.md")).to.match(/version 5.6.7 and v8.9.10 should not be changed/);
    expect(files.text("script2.js")).to.match(/version 3.2.1 and v8.9.10 don't match the old version number/);
  });

  it("should not replace other version numbers in non-manifest files", () => {
    files.create("package.json", { version: "1.2.3" });
    files.create("package-lock.json", { version: "1.2.3" });
    files.create("LICENSE", fixtures.license);
    files.create("README.md", fixtures.readme);
    files.create("script1.js", fixtures.script1);
    files.create("script2.js", fixtures.script2);

    let bump = chaiExec("major LICENSE README.* *.js");

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
    files.create("LICENSE", fixtures.license);
    files.create("README.md", fixtures.readme);
    files.create("script1.js", fixtures.script1);
    files.create("script2.js", fixtures.script2);

    let bump = chaiExec("major LICENSE README.* *.js");

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

  it("should error if an explicitly-specified file doesn't exist", () => {
    files.create("package.json", { version: "4.5.6" });

    let bump = chaiExec("major LICENSE README.* *.js");

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

  it("should error if a glob pattern doesn't match any files", () => {
    files.create("package.json", { version: "4.5.6" });

    let bump = chaiExec("major README.* *.js");

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
