import { ReleaseType } from "semver";
export { ReleaseType } from "semver";

/**
 * The different types of pre-releases.
 */
export const prereleaseTypes = ["preminor", "patch", "prepatch", "prerelease"];

/**
 * All possible release types.
 */
export const releaseTypes = prereleaseTypes.concat(["major", "premajor", "minor"]);

/**
 * Determines whether the specified value is a pre-release.
 */
export function isPrerelease(value: string): boolean {
  return prereleaseTypes.includes(value);
}

/**
 * Determines whether the specified value is a valid ReleaseType string.
 */
export function isReleaseType(value: string): value is ReleaseType {
  return releaseTypes.includes(value);
}
