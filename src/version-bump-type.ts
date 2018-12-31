/**
 * Types of version bumps that can be performed.
 */
export enum VersionBumpType {
  /**
   * Prompts the user for the version number.
   */
  Prompt = "prompt",

  /**
   * Bumps the major version number (e.g. 1.23.456 => 2.0.0)
   */
  Major = "major",

  /**
   * Bumps the minor version number (e.g. 1.23.456 => 1.3.0)
   */
  Minor = "minor",

  /**
   * Bumps the patch version number (e.g. 1.23.456 => 1.23.457)
   */
  Patch = "patch",

  /**
   * Bumps the premajor version number (e.g. 1.23.456 => 2.0.0-beta.1)
   */
  Premajor = "premajor",

  /**
   * Bumps the preminor version number (e.g. 1.23.456 => 1.3.0-beta.1)
   */
  Preminor = "preminor",

  /**
   * Bumps the prepatch version number (e.g. 1.23.456 => 1.23.457-beta.1)
   */
  Prepatch = "prepatch",

  /**
   * Bumps the prerelease version number (e.g. 1.23.456-beta.7 => 1.23.456-beta.8)
   */
  Prerelease = "prerelease",
}

/**
 * Determines whether the specified value is a valid VersionBumpType string.
 */
export function isVersionBumpType(value: string): value is VersionBumpType {
  switch (value) {
    case VersionBumpType.Prompt:
    case VersionBumpType.Major:
    case VersionBumpType.Minor:
    case VersionBumpType.Patch:
    case VersionBumpType.Premajor:
    case VersionBumpType.Preminor:
    case VersionBumpType.Prepatch:
    case VersionBumpType.Prerelease:
      return true;

    default:
      return false;
  }
}
