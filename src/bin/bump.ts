#!/usr/bin/env node

import * as cli from "commander";
import * as semver from "semver";
import { isVersionBumpType, versionBump, VersionBumpOptions } from "../lib";

// tslint:disable-next-line: no-floating-promises
main(process.argv.slice(2));

/**
 * The main entry point
 */
async function main(args: string[]): Promise<void> {
  let options = parseArgs(args);
  await versionBump(options);
}

/**
 * Parses the  command-line arguments
 */
function parseArgs(args: string[]): VersionBumpOptions {
  cli
    .arguments("[version] [files...]")
    .option("--preid <name>", 'The identifier for prerelease versions (default is "beta")')
    .option("--commit [message]", 'Commit changed files to Git (default message is "release vX.X.X")')
    .option("--tag [tag]", 'Tag the commit in Git (default tag is "vX.X.X")')
    .option("--push", "Push the Git commit")
    .option("--all", "Commit/tag/push ALL pending files, not just the ones changed by bump")
    .version(require("../package").version)
    .on("--help", showHelp)
    .parse(process.argv);

  // Convert CLI args to an Options object
  let options: VersionBumpOptions = {
    preid: cli.preid as string,
    commit: cli.commit as boolean,
    tag: cli.tag as boolean,
    push: cli.push as boolean,
    all: cli.all as boolean,
  };

  if (cli.args.length > 0) {
    let firstArg = cli.args[0];

    if (isVersionBumpType(firstArg) && semver.valid(firstArg)) {
      options.version = firstArg;
      cli.args.shift();
    }

    options.files = cli.args;
  }

  return options;
}

/**
 * Appends additional help text to the default text that Commander prints
 */
function showHelp(): void {
  // tslint:disable-next-line: no-console
  console.log(`

Version
  One of the following:
    - A semver version number (ex: 1.23.456)
    - prompt: Prompt for the version number (this is the default)
    - major: Increase major version
    - minor: Increase minor version
    - patch: Increase patch version
    - premajor: Increase major version, pre-release
    - preminor: Increase preminor version, pre-release
    - prepatch: Increase prepatch version, pre-release
    - prerelease: Increase prerelease version

Files...
  One or more files and/or globs to bump (ex: README.md *.txt).
  package.json and package-lock.json are always updated.

Examples:

  bump patch

    Bumps the patch version number in package.json and package-lock.json.
    Nothing is committed to git.

  bump --commit major

    Bumps the major version number in package.json and package-lock.json.
    Commits the package.json and package-lock.json to git, but does not tag the commit.

  bump --tag --push --all README.md

    Prompts for the new version number and updates package.json, package-lock.json, and README.md.
    Commits ALL modified files to git, tags the commit, and pushes the commit.

  bump --tag --push 4.27.9934 bower.json docs/**/*.md

    Sets the version number to 4.27.9934 in package.json, package-lock.json, bower.json,
    and all markdown files in the "docs" directory.  Commits the updated files to git,
    tags the commit, and pushes the commit.
`);
}
