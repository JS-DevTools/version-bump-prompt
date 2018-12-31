/**
 * Options for the `versionBump()` function.
 */
export interface VersionBumpOptions {
  /**
   * The new version number (e.g. "1.23.456") or the type of version bump to perform
   * (e.g. "major", "minor", "patch", "prerelease", etc.).  Use "prompt" to prompt the
   * user for the version number.
   *
   * Defaults to "prompt".
   */
  version?: string;

  /**
   * The prerelease type (e.g. "alpha", "beta", "next").
   *
   * Defaults to "beta".
   */
  preid?: string;

  /**
   * Indicates whether to create a git commit. Can be set to a custom commit message string
   * or `true` to use "release v" (the version number will be appended).
   *
   * Defaults to `false`.
   */
  commit?: boolean | string;

  /**
   * Indicates whether to tag the git commit. Can be set to a custom tag string
   * or `true` to use "v" (the version number will be appended).
   *
   * Defaults to `false`.
   */
  tag?: boolean | string;

  /**
   * Indicates whether to push the git commit and tag.
   *
   * Defaults to `false`.
   */
  push?: boolean;

  /**
   * Indicates whether the git commit should include ALL files (`git commit -a`)
   * rather than just the files that were modified by `versionBump()`.
   *
   * Defaults to `false`.
   */
  all?: boolean;

  /**
   * The files to be updated. For certain known files ("package.json", "bower.json", etc.)
   * `versionBump()` will explicitly update the file's version number.  For other files
   * (ReadMe files, config files, source code, etc.) it will simply do a global replacement
   * of the old version number with the new version number.
   *
   * Defaults to ["package.json", "package-lock.json"]
   */
  files?: string[];
}
