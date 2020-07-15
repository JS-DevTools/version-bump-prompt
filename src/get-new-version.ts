import * as inquirer from "inquirer";
import * as semver from "semver";
import { ReleaseType, SemVer } from "semver";
import { BumpRelease, PromptRelease } from "./normalize-options";
import { Operation } from "./operation";
import { isPrerelease, releaseTypes } from "./release-type";

/**
 * Determines the new version number, possibly by prompting the user for it.
 */
export async function getNewVersion(operation: Operation): Promise<Operation> {
  let { release } = operation.options;
  let { oldVersion } = operation.state;

  switch (release.type) {
    case "prompt":
      return promptForNewVersion(operation);

    case "version":
      let newSemVer = new SemVer(release.version, true);
      return operation.update({
        newVersion: newSemVer.version,
      });

    default:
      return operation.update({
        release: release.type,
        newVersion: getNextVersion(oldVersion, release),
      });
  }
}

/**
 * Returns the next version number of the specified type.
 */
function getNextVersion(oldVersion: string, bump: BumpRelease): string {
  let oldSemVer = new SemVer(oldVersion);
  let newSemVer = oldSemVer.inc(bump.type, bump.preid);

  if (
    isPrerelease(bump.type) &&
    newSemVer.prerelease.length === 2 &&
    newSemVer.prerelease[0] === bump.preid &&
    String(newSemVer.prerelease[1]) === "0"
  ) {
    // This is a special case when going from a non-prerelease version to a prerelease version.
    // SemVer sets the prerelease version to zero (e.g. "1.23.456" => "1.23.456-beta.0").
    // But the user probably expected it to be "1.23.456-beta.1" instead.
    // @ts-expect-error - TypeScript thinks this array is read-only
    newSemVer.prerelease[1] = "1";
    newSemVer.format();
  }

  return newSemVer.version;
}

/**
 * Returns the next version number for all release types.
 */
function getNextVersions(oldVersion: string, preid: string): Record<ReleaseType, string> {
  let next: Record<string, string> = {};

  for (let type of releaseTypes) {
    next[type] = getNextVersion(oldVersion, { type, preid });
  }

  return next;
}

/**
 * Prompts the user for the new version number.
 *
 * @returns - A tuple containing the new version number and the release type (if any)
 */
async function promptForNewVersion(operation: Operation): Promise<Operation> {
  let { oldVersion, oldVersionSource } = operation.state;
  let release = operation.options.release as PromptRelease;
  let prompts = inquirer.createPromptModule(operation.options.interface as inquirer.StreamOptions);

  let next = getNextVersions(oldVersion, release.preid);

  let answers: {
    release: ReleaseType | "none" | "custom";
    newVersion?: string;
  };

  answers = await prompts([
    {
      type: "list",
      name: "release",
      message: `\nThe current version in ${oldVersionSource} is ${oldVersion}\nHow would you like to bump it?`,
      default: "patch",
      pageSize: 10,
      choices: [
        { value: "major", name: `major (${next.major})` },
        { value: "minor", name: `minor (${next.minor})` },
        { value: "patch", name: `patch (${next.patch})` },
        { value: "premajor", name: `pre-release major (${next.premajor})` },
        { value: "preminor", name: `pre-release minor (${next.preminor})` },
        { value: "prepatch", name: `pre-release patch (${next.prepatch})` },
        { value: "prerelease", name: `pre-release (${next.prerelease})` },
        new inquirer.Separator(),
        { value: "none", name: `leave as-is (${oldVersion})` },
        { value: "custom", name: "custom..." },
      ]
    },
    {
      type: "input",
      name: "newVersion",
      message: "Enter the new version number:",
      default: oldVersion,
      when: (previousAnswer) => previousAnswer.release === "custom",
      filter: semver.clean,
      validate: (newVersion: string) => {
        return semver.valid(newVersion) ? true : "That's not a valid version number";
      },
    }
  ]);

  switch (answers.release) {
    case "none":
      return operation.update({ newVersion: oldVersion });

    case "custom":
      return operation.update({ newVersion: answers.newVersion! });

    default:
      return operation.update({
        release: answers.release,
        newVersion: next[answers.release],
      });
  }
}
