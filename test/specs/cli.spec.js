"use strict";

const files = require("../utils/files");
const chaiExec = require("chai-exec");
const manifest = require("../../package.json");

describe("bump", () => {

  it.skip("should run without any arguments", () => {
    files.create("package.json", { version: "1.0.0" });

    let bump = chaiExec("", { timeout: 1000 });

    bump.signal.should.equal("SIGKILL");

    bump.should.have.stderr("");
    bump.stdout.should.contain("PROMPT TEXT");
  });

  it("should error if an invalid argument is used", () => {
    let bump = chaiExec("--commit --help --fizzbuzz --tag");

    bump.should.have.exitCode(1);
    bump.should.have.stdout("");
    bump.stderr.should.match(/^Unknown option: --fizzbuzz\n\nUsage: bump \[release\] \[options\] \[files...\]\n/);
    bump.stderr.should.contain(manifest.description);
  });

  it("should error if an invalid shorthand argument is used", () => {
    let bump = chaiExec("-chzt");

    bump.should.have.exitCode(1);
    bump.should.have.stdout("");
    bump.stderr.should.match(/^Unknown option: -z\n\nUsage: bump \[release\] \[options\] \[files...\]\n/);
    bump.stderr.should.contain(manifest.description);
  });

  it("should error if an argument is missing its value", () => {
    let bump = chaiExec("--commit --help --preid --tag");

    bump.should.have.exitCode(1);
    bump.should.have.stdout("");
    bump.stderr.should.match(
      /^The --preid option requires a value, such as "alpha", "beta", etc\.\n\nUsage: bump \[release\] \[options\] \[files...\]\n/
    );
    bump.stderr.should.contain(manifest.description);
  });

  describe("bump --help", () => {
    it("should show usage text", () => {
      let bump = chaiExec("--help");

      bump.should.have.exitCode(0);
      bump.should.have.stderr("");
      bump.stdout.should.match(/^\nUsage: bump \[release\] \[options\] \[files...\]\n/);
      bump.stdout.should.contain(manifest.description);
    });

    it("should support -h shorthand", () => {
      let bump = chaiExec("-h");

      bump.should.have.exitCode(0);
      bump.should.have.stderr("");
      bump.stdout.should.match(/^\nUsage: bump \[release\] \[options\] \[files...\]\n/);
      bump.stdout.should.contain(manifest.description);
    });

    it("should ignore other arguments", () => {
      let bump = chaiExec("--commit --help --tag");

      bump.should.have.exitCode(0);
      bump.should.have.stderr("");
      bump.stdout.should.match(/^\nUsage: bump \[release\] \[options\] \[files...\]\n/);
      bump.stdout.should.contain(manifest.description);
    });

    it("should ignore other shorthand arguments", () => {
      let bump = chaiExec("-cht");

      bump.should.have.exitCode(0);
      bump.should.have.stderr("");
      bump.stdout.should.match(/^\nUsage: bump \[release\] \[options\] \[files...\]\n/);
      bump.stdout.should.contain(manifest.description);
    });
  });

  describe("bump --version", () => {
    it("should show the version number", () => {
      let bump = chaiExec("--version");

      bump.should.have.exitCode(0);
      bump.should.have.stderr("");
      bump.should.have.stdout(manifest.version + "\n");
    });

    it("should support -v shorthand", () => {
      let bump = chaiExec("-v");

      bump.should.have.exitCode(0);
      bump.should.have.stderr("");
      bump.should.have.stdout(manifest.version + "\n");
    });

    it("should ignore other arguments", () => {
      let bump = chaiExec("--commit --version --tag");

      bump.should.have.exitCode(0);
      bump.should.have.stderr("");
      bump.should.have.stdout(manifest.version + "\n");
    });

    it("should ignore other shorthand arguments", () => {
      let bump = chaiExec("-cvt");

      bump.should.have.exitCode(0);
      bump.should.have.stderr("");
      bump.should.have.stdout(manifest.version + "\n");
    });
  });
});
