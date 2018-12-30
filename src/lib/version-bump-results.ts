/**
 * Information about the work that was performed by the `versionBump()` function.
 */
export interface VersionBumpResults {
  /**
   * The previous version number in package.json.
   */
  oldVersion: string;

  /**
   * The new version number.
   */
  newVersion: string;

  /**
   * The commit message that was used for the git commit.
   * If no git commit was created, then this is `undefined`.
   */
  commitMessage?: string;

  /**
   * The tag name that was used for the git tag.
   * If no tag was created, then this is `undefined`.
   */
  tagName?: string;

  /**
   * The files that were updated.
   */
  files: string[];
}
