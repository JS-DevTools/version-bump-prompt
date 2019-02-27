import * as inquirer from "inquirer";
import * as semver from "semver";
import { ReleaseType, SemVer } from "semver"; // tslint:disable-line: no-duplicate-imports
import { NormalizedOptions } from "./normalize-options";
import { isPrerelease, isReleaseType, releaseTypes } from "./release-type";

type Params = NormalizedOptions & { oldVersion: string };
type VersionAndReleaseType = [string, ReleaseType?];

/**
 * Returns the new version number, possibly by prompting the user for it.
 *
 * @returns - A tuple containing the new version number and the release type (if any)
 */
export async function getNewVersion(params: Params): Promise<VersionAndReleaseType> {
  let { release } = params;

  if (release === "prompt") {
    return promptForNewVersion(params);
  }
  else if (isReleaseType(release)) {
    return [getNextVersion(params), release];
  }
  else {
    let newSemVer = new SemVer(release.version, true);
    return [newSemVer.version];
  }
}

/**
 * Returns the next version number of the specified type.
 */
function getNextVersion({ oldVersion, release, preid }: Params): string {
  let oldSemVer = new SemVer(oldVersion);
  let newSemVer = oldSemVer.inc(release as ReleaseType, preid);

  if (
    isPrerelease(release) &&
    newSemVer.prerelease.length === 2 &&
    newSemVer.prerelease[0] === preid &&
    String(newSemVer.prerelease[1]) === "0"
  ) {
    // This is a special case when going from a non-prerelease version to a prerelease version.
    // SemVer sets the prerelease version to zero (e.g. "1.23.456" => "1.23.456-beta.0").
    // But the user probably expected it to be "1.23.456-beta.1" instead.
    newSemVer.prerelease[1] = "1";
    newSemVer.format();
  }

  return newSemVer.version;
}

/**
 * Returns the next version number for all release types.
 */
function getNextVersions(params: Params): Record<ReleaseType, string> {
  let next: Record<string, string> = {};

  for (let release of releaseTypes) {
    next[release] = getNextVersion({ ...params, release });
  }

  return next;
}

/**
 * Prompts the user for the new version number.
 *
 * @returns - A tuple containing the new version number and the release type (if any)
 */
async function promptForNewVersion(params: Params): Promise<VersionAndReleaseType> {
  let { oldVersion, interface: ui } = params;
  let next = getNextVersions(params);
  let prompts = inquirer.createPromptModule(ui as inquirer.StreamOptions);

  let answers: {
    release: ReleaseType | "none" | "custom";
    newVersion?: string;
  };

  answers = await prompts([
    {
      type: "list",
      name: "release",
      message: `\nThe current version is ${oldVersion}\nHow would you like to bump it?`,
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
      when: ({ release }) => release === "custom",
      filter: semver.clean,
      validate: (newVersion: string) => {
        return semver.valid(newVersion) ? true : "That's not a valid version number";
      },
    }
  ]);

  switch (answers.release) {
    case "none":
      return [oldVersion];

    case "custom":
      return [answers.newVersion!];

    default:
      return [next[answers.release], answers.release];
  }
}
