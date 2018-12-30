#!/usr/bin/env node
"use strict";

const cli = require("commander");
const semver = require("semver");
const inquirer = require("inquirer");
const chalk = require("chalk");
const api = require("../");

cli
  .arguments("[version] [files...]")
  .option("--preid <name>", 'The identifier for prerelease versions (default is "beta")')
  .option("--commit [message]", 'Commit changed files to Git (default message is "release vX.X.X")')
  .option("--tag", "Tag the commit in Git")
  .option("--push", "Push the Git commit")
  .option("--all", "Commit/tag/push ALL pending files, not just the ones changed by bump")
  .version(require("../package").version)
  .on("--help", () => {
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
`
    );
  })
  .parse(process.argv);

// Convert CLI args to an Options object
let options = {
  version: "prompt",
  preid: cli.preid || "beta",
  commit: !!cli.commit,
  commitMessage: "",
  tag: !!cli.tag,
  push: !!cli.push,
  all: !!cli.all,
  files: ["package.json", "package-lock.json"],
};

if (typeof cli.commit === "string") {
  options.commitMessage = cli.commit;
}

if (cli.args.length > 0) {
  let firstArg = cli.args[0];
  let bumps = ["prompt", "major", "minor", "patch", "premajor", "preminor", "prepatch", "prerelease"];

  if (semver.valid(firstArg) || bumps.includes(firstArg)) {
    options.version = firstArg;
    cli.args.shift();
  }

  options.files.push(...cli.args);
}

console.log(options);
process.exit(0);


let manifests = api.manifests(options.lock);
bumpManifests(manifests, options)
  .then(() => {
    api.grep(manifests, options);
    manifests.forEach((manifest) => {
      api.runNpmScriptIfExists(manifest, "version");
    });
  })
  .then(() => {
    if (options.commit || options.tag || options.push) {
      api.git(manifests, options);
    }
    else {
      manifests.forEach((manifest) => {
        api.runNpmScriptIfExists(manifest, "postversion");
      });
    }
  })
  .catch((err) => {
    console.error(chalk.red(err.message));
    process.exit(err.status || 1);
  });


/**
 * Bumps each manifest sequentially
 *
 * @param {string[]} manifests - An array of manifest files to bump
 * @param {object} options - CLI options
 * @returns {Promise}
 */
function bumpManifests (manifests, options) {
  let i = 0;

  return bumpNext("patch");

  function bumpNext (defaultBumpType) {
    let manifest = manifests[i++];
    if (manifest) {
      return bumpManifest(manifest, defaultBumpType, options).then(bumpNext);
    }
    else {
      return Promise.resolve(defaultBumpType);
    }
  }
}

/**
 * Bumps the given manifest
 *
 * @param {string} manifest - The manifest name (e.g. "package.json", "bower.json", etc.)
 * @param {string} defaultBumpType - The default type of bump to perform
 * @param {object} options - CLI options
 * @returns {Promise}
 */
function bumpManifest (manifest, defaultBumpType, options) {
  return new Promise((resolve, reject) => {
    api.runNpmScriptIfExists(manifest, "preversion");

    if (options.prompt) {
      // Prompt the user for the type of bump to perform
      let version = api.versionInfo(manifest, options);
      console.log("\nCurrent version in %s is %s", manifest, version.current);

      inquirer.prompt([
        {
          type: "list",
          name: "bumpType",
          message: "How would you like to bump it?",
          default: defaultBumpType,
          pageSize: 9,
          choices: [
            { value: "major", name: "major (" + version.nextMajor + ")" },
            { value: "minor", name: "minor (" + version.nextMinor + ")" },
            { value: "patch", name: "patch (" + version.nextPatch + ")" },
            { value: "premajor", name: "pre-release major (" + version.nextPreMajor + ")" },
            { value: "preminor", name: "pre-release minor (" + version.nextPreMinor + ")" },
            { value: "prepatch", name: "pre-release patch (" + version.nextPrePatch + ")" },
            { value: "prerelease", name: "pre-release (" + version.nextPreRelease + ")" },
            new inquirer.Separator(),
            { value: "custom", name: "custom..." },
          ]
        },
        {
          type: "input",
          name: "newVersion",
          message: "Enter the new version number:",
          default: version.current,
          when: answers => answers.bumpType === "custom",
          filter: semver.clean,
          validate: answer => {
            return semver.valid(answer) ? true : "That's not a valid version number";
          },
        }
      ])
        .then((answers) => {
          bump(answers.bumpType, answers.newVersion);
        });
    }
    else {
      let bumpType =
            options.major ? "major"
              : options.minor ? "minor"
                : options.patch ? "patch"
                  : options.premajor ? "premajor"
                    : options.preminor ? "preminor"
                      : options.prepatch ? "prepatch"
                        : options.prerelease ? "prerelease"
                          : defaultBumpType;

      bump(bumpType);
    }

    function bump (bumpType, newVersion) {
      try {
        options.newVersion = newVersion;
        api.bump(manifest, bumpType, options);
      }
      catch (ex) {
        reject(ex);
      }
      resolve(bumpType);
    }
  });
}
