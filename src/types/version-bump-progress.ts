import { VersionBumpResults } from "./version-bump-results";

/**
 * Progress events that indicate the progress of the `versionBump()` function.
 */
export const enum ProgressEvent {
  FileUpdated = "file updated",
  GitCommit = "git commit",
  GitTag = "git tag",
  GitPush = "git push",
}

/**
 * Information about the progress of the `versionBump()` function.
 */
export interface VersionBumpProgress extends VersionBumpResults {
  event: ProgressEvent;
}
