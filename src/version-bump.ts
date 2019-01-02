import { getNewVersion } from "./get-new-version";
import { getOldVersion } from "./get-old-version";
import { Options } from "./options";
import { updateFiles } from "./update-files";
import { VersionBumpOptions } from "./version-bump-options";
import { VersionBumpResults } from "./version-bump-results";

/**
 * Prompts the user for a version number and updates package.json and package-lock.json.
 *
 * @returns - The new version number
 */
export async function versionBump(): Promise<VersionBumpResults>;

/**
 * Bumps the version number in package.json, package-lock.json.
 *
 * @param release
 * The release version or type. Can be one of the following:
 *
 * - The new version number (e.g. "1.23.456")
 * - A release type (e.g. "major", "minor", "patch", "prerelease", etc.)
 * - "prompt" to prompt the user for the version number
 */
export async function versionBump(release: string): Promise<VersionBumpResults>;

/**
 * Bumps the version number in one or more files, prompting the user if necessary.
 * Optionally also commits, tags, and pushes to git.
 */
export async function versionBump(options: VersionBumpOptions): Promise<VersionBumpResults>;

export async function versionBump(arg: VersionBumpOptions | string = {}): Promise<VersionBumpResults> {
  if (typeof arg === "string") {
    arg = { release: arg };
  }

  let options = new Options(arg);
  let oldVersion = await getOldVersion(options);
  let [newVersion, release] = await getNewVersion({ ...options, oldVersion });
  let files = await updateFiles({ ...options, oldVersion, newVersion });

  if (options.commit) {
    options.commit.message += newVersion;
  }

  if (options.tag) {
    options.tag.name += newVersion;
  }

  return {
    release,
    oldVersion,
    newVersion,
    commit: options.commit ? options.commit.message : false,
    tag: options.tag ? options.tag.name : false,
    files,
  };
}
