import * as ezSpawn from "ez-spawn";
import { Options } from "./options";

type Params = Options & { files: string[]; newVersion: string };

/**
 * Commits the modififed files to Git, if the `commit` option is enabled.
 *
 * @returns - The commit message, or `false` if nothing was committed
 */
export async function gitCommit({ commit, files, newVersion }: Params): Promise<string | false> {
  if (!commit) {
    return false;
  }

  let { all, noVerify, message } = commit;
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
  message = formatVersionString(message, newVersion);
  args.push("--message", message);

  // Append the file names last, as variadic arguments
  if (!all) {
    args = args.concat(files);
  }

  await ezSpawn.async("git", ["commit", ...args]);
  return message;
}

/**
 * Tags the Git commit, if the `tag` option is enabled.
 *
 * @returns - The tag name, or `false` if no tag was created
 */
export async function gitTag({ commit, tag, newVersion }: Params): Promise<string | false> {
  if (!commit || !tag) {
    return false;
  }

  let args = [
    // Create an annotated tag, which is recommended for releases.
    // See https://git-scm.com/docs/git-tag
    "--annotate",

    // Use the same commit message for the tag
    "--message", formatVersionString(commit.message, newVersion),
  ];

  // Create the Tag name
  let name = formatVersionString(tag.name, newVersion);
  args.push(name);

  await ezSpawn.async("git", ["tag", ...args]);
  return name;
}

/**
 * Pushes the Git commit and tag, if the `push` option is enabled.
 */
export async function gitPush({ push, tag }: Options): Promise<void> {
  if (!push) {
    return;
  }

  // Push the commit
  await ezSpawn.async("git", "push");

  if (tag) {
    // Push the tag
    await ezSpawn.async("git", ["push", "--tags"]);
  }
}

/**
 * Accepts a version string template (e.g. "release v" or "This is the %s release").
 * If the template contains any "%s" placeholders, then they are replaced with the version number;
 * otherwise, the version number is appended to the string.
 */
function formatVersionString(template: string, newVersion: string): string {
  if (template.includes("%s")) {
    return template.replace(/%s/g, newVersion);
  }
  else {
    return template + newVersion;
  }
}
