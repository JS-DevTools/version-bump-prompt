"use strict";

const { files, bump } = require("../utils");
const { expect } = require("chai");
const manifest = require("../../package.json");

describe("bump", () => {

  it("should run without any arguments", () => {
    // Create a dummy package.json, otherwise an error will occur
    files.create("package.json", { version: "1.0.0" });

    // Run the CLI without any arguments.
    // It will prompt the user and wait forever, so add a timeout.
    let cli = bump("");

    expect(cli.stdout).to.match(/The current version in package.json is 1.0.0\nHow would you like to bump it\?/);
  });

  it("should error if an invalid argument is used", () => {
    let cli = bump("--commit --help --fizzbuzz --quiet");

    expect(cli).to.have.exitCode(9);
    expect(cli).to.have.stdout("");
    expect(cli.stderr).to.match(/^Unknown option: --fizzbuzz\n\nUsage: bump \[release\] \[options\] \[files...\]\n/);
  });

  it("should error if an invalid shorthand argument is used", () => {
    let cli = bump("-cqhzt");

    expect(cli).to.have.exitCode(9);
    expect(cli).to.have.stdout("");
    expect(cli.stderr).to.match(/^Unknown option: -z\n\nUsage: bump \[release\] \[options\] \[files...\]\n/);
  });

  it("should error if an argument is missing its value", () => {
    let cli = bump("--commit --help --preid --quiet");

    expect(cli).to.have.exitCode(9);
    expect(cli).to.have.stdout("");
    expect(cli.stderr).to.match(
      /^The --preid option requires a value, such as "alpha", "beta", etc\.\n\nUsage: bump \[release\] \[options\] \[files...\]\n/
    );
  });

  it("should print a more detailed error if DEBUG is set", () => {
    files.create("package.json", { version: "" });

    let cli = bump("major", { env: { ...process.env, DEBUG: "true", NODE_OPTIONS: "" }});

    expect(cli).to.have.stdout("");
    expect(cli).to.have.exitCode(1);

    expect(cli).to.have.stderr.that.matches(
      /^Error: Unable to determine the current version number. Checked package.json.\n\s+at \w+/
    );

    expect(files.json("package.json")).to.deep.equal({ version: "" });
  });

  describe("bump --help", () => {
    it("should show usage text", () => {
      let cli = bump("--help");

      expect(cli).to.have.exitCode(0);
      expect(cli).to.have.stderr("");
      expect(cli.stdout).to.contain(manifest.description);
      expect(cli.stdout).to.match(/\nUsage: bump \[release\] \[options\] \[files...\]\n/);
    });

    it("should support -h shorthand", () => {
      let cli = bump("-h");

      expect(cli).to.have.exitCode(0);
      expect(cli).to.have.stderr("");
      expect(cli.stdout).to.contain(manifest.description);
      expect(cli.stdout).to.match(/\nUsage: bump \[release\] \[options\] \[files...\]\n/);
    });

    it("should ignore other arguments", () => {
      let cli = bump("--quiet --help --tag");

      expect(cli).to.have.exitCode(0);
      expect(cli).to.have.stderr("");
      expect(cli.stdout).to.contain(manifest.description);
      expect(cli.stdout).to.match(/\nUsage: bump \[release\] \[options\] \[files...\]\n/);
    });

    it("should ignore other shorthand arguments", () => {
      let cli = bump("-cht");

      expect(cli).to.have.exitCode(0);
      expect(cli).to.have.stderr("");
      expect(cli.stdout).to.contain(manifest.description);
      expect(cli.stdout).to.match(/\nUsage: bump \[release\] \[options\] \[files...\]\n/);
    });
  });

  describe("bump --version", () => {
    it("should show the version number", () => {
      let cli = bump("--version");

      expect(cli).to.have.exitCode(0);
      expect(cli).to.have.stderr("");
      expect(cli).to.have.stdout(manifest.version + "\n");
    });

    it("should support -v shorthand", () => {
      let cli = bump("-v");

      expect(cli).to.have.exitCode(0);
      expect(cli).to.have.stderr("");
      expect(cli).to.have.stdout(manifest.version + "\n");
    });

    it("should ignore other arguments", () => {
      let cli = bump("--quiet --version --tag");

      expect(cli).to.have.exitCode(0);
      expect(cli).to.have.stderr("");
      expect(cli).to.have.stdout(manifest.version + "\n");
    });

    it("should ignore other shorthand arguments", () => {
      let cli = bump("-cvt");

      expect(cli).to.have.exitCode(0);
      expect(cli).to.have.stderr("");
      expect(cli).to.have.stdout(manifest.version + "\n");
    });
  });
});
