import { ReleaseType, SemVer } from "semver";
import { isVersionBumpType, VersionBumpType } from "./version-bump-type";

/**
 * Returns the new version number, possibly by prompting the user for it.
 *
 * @param oldVersion - The old (current) version number
 * @param version - The new version number, or a VersionBumpType
 * @param preid - Optional prerelease identifier (e.g. "alpha", "beta", etc.)
 */
export async function getNewVersion(oldVersion: string, newVersion: string, preid?: string): Promise<string> {
  if (newVersion === VersionBumpType.Prompt) {
    return "";
  }
  else if (isVersionBumpType(newVersion)) {
    let oldSemVer = new SemVer(oldVersion);
    let newSemVer = oldSemVer.inc(newVersion as ReleaseType, preid);
    return newSemVer.version;
  }
  else {
    let newSemVer = new SemVer(newVersion, true);
    return newSemVer.version;
  }
}
