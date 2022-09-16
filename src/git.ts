import * as ezSpawn from "@jsdevtools/ez-spawn";
import { Operation } from "./operation";
import { ProgressEvent } from "./types/version-bump-progress";

/**
 * Commits the modififed files to Git, if the `commit` option is enabled.
 */
export async function gitCommit(operation: Operation): Promise<Operation> {
  if (!operation.options.commit) {
    return operation;
  }

  let { all, noVerify, message } = operation.options.commit;
  let { updatedFiles, newVersion, oldVersion } = operation.state;
  let args = [];

  if (all) {
    // Commit ALL files, not just the ones that were bumped
    args.push("--all");
  }

  if (noVerify) {
    // Bypass git commit hooks
    args.push("--no-verify");
  }

  // Create the commit message
  let commitMessage = formatVersionString(message, newVersion, oldVersion);
  args.push("--message", commitMessage);

  // Append the file names last, as variadic arguments
  if (!all) {
    args = args.concat(updatedFiles);
  }

  await ezSpawn.async("git", ["commit", ...args]);

  return operation.update({ event: ProgressEvent.GitCommit, commitMessage });
}

/**
 * Tags the Git commit, if the `tag` option is enabled.
 */
export async function gitTag(operation: Operation): Promise<Operation> {
  if (!operation.options.tag) {
    return operation;
  }

  let { commit, tag } = operation.options;
  let { newVersion, oldVersion } = operation.state;

  let args = [
    // Create an annotated tag, which is recommended for releases.
    // See https://git-scm.com/docs/git-tag
    "--annotate",

    // Use the same commit message for the tag
    "--message", formatVersionString(commit!.message, newVersion, oldVersion),
  ];

  // Create the Tag name
  let tagName = formatVersionString(tag.name, newVersion, oldVersion);
  args.push(tagName);

  await ezSpawn.async("git", ["tag", ...args]);

  return operation.update({ event: ProgressEvent.GitTag, tagName });
}

/**
 * Pushes the Git commit and tag, if the `push` option is enabled.
 */
export async function gitPush(operation: Operation): Promise<Operation> {
  if (!operation.options.push) {
    return operation;
  }

  // Push the commit
  await ezSpawn.async("git", "push");

  if (operation.options.tag) {
    // Push the tag
    await ezSpawn.async("git", ["push", "--tags"]);
  }

  return operation.update({ event: ProgressEvent.GitPush });
}

/**
 * Accepts a version string template (e.g. "release v" or "This is the %s release").
 * If the template contains any "%s" placeholders, then they are replaced with the version number;
 * otherwise, the version number is appended to the string.
 */
function formatVersionString(template: string, newVersion: string, oldVersion: string): string {
  if (template.includes("%s")) {
    return template.replace(/%s/g, newVersion).replace(/%o/g, oldVersion);
  }
  else {
    return template + newVersion;
  }
}
