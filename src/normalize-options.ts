import * as globby from "globby";
import { hasMagic } from "globby";
import { isReleaseType, ReleaseType } from "./release-type";
import { VersionBumpOptions } from "./types/version-bump-options";

interface Interface {
  input?: NodeJS.ReadableStream | NodeJS.ReadStream | false;
  output?: NodeJS.WritableStream | NodeJS.WriteStream | false;
  [key: string]: unknown;
}

/**
 * A specific version release.
 */
export interface VersionRelease {
  type: "version";
  version: string;
}

/**
 * Prompt the user for the release number.
 */
export interface PromptRelease {
  type: "prompt";
  preid: string;
}

/**
 * A bump release, relative to the current version number.
 */
export interface BumpRelease {
  type: ReleaseType;
  preid: string;
}

/**
 * One of the possible Release types.
 */
export type Release = VersionRelease | PromptRelease | BumpRelease;

/**
 * Normalized and sanitized options
 */
export interface NormalizedOptions {
  release: Release;
  commit?: {
    message: string;
    noVerify: boolean;
    all: boolean;
  };
  tag?: {
    name: string;
  };
  push: boolean;
  files: string[];
  cwd: string;
  interface: Interface;
  ignoreScripts: boolean;
}

/**
 * Converts raw VersionBumpOptions to a normalized and sanitized Options object.
 */
export async function normalizeOptions(raw: VersionBumpOptions): Promise<NormalizedOptions> {
  // Set the simple properties first
  let preid = typeof raw.preid === "string" ? raw.preid : "beta";
  let push = Boolean(raw.push);
  let all = Boolean(raw.all);
  let noVerify = Boolean(raw.noVerify);
  let cwd = raw.cwd || process.cwd();
  let ignoreScripts = Boolean(raw.ignoreScripts);

  let release: Release;
  if (!raw.release || raw.release === "prompt") {
    release = { type: "prompt", preid };
  }
  else if (isReleaseType(raw.release)) {
    release = { type: raw.release, preid };
  }
  else {
    release = { type: "version", version: raw.release };
  }

  let tag;
  if (typeof raw.tag === "string") {
    tag = { name: raw.tag };
  }
  else if (raw.tag) {
    tag = { name: "v" };
  }

  // NOTE: This must come AFTER `tag` and `push`, because it relies on them
  let commit;
  if (typeof raw.commit === "string") {
    commit = { all, noVerify, message: raw.commit };
  }
  else if (raw.commit || tag || push) {
    commit = { all, noVerify, message: "release v" };
  }

  let files;
  if (Array.isArray(raw.files) && raw.files.length > 0) {
    files = await strictGlobMatches(raw.files, { cwd });
  }
  else {
    // Try to find these files by default.
    // If they don't exist, then they will NOT be included in the `files` array.
    files = await globby(["package.json", "package-lock.json"], { cwd });
  }

  let ui: Interface;
  if (raw.interface === false) {
    ui = { input: false, outut: false };
  }
  else if (raw.interface === true || !raw.interface) {
    ui = { input: process.stdin, output: process.stdout };
  }
  else {
    let { input, output, ...other } = raw.interface;

    if (input === true || (input !== false && !input)) {
      input = process.stdin;
    }

    if (output === true || (output !== false && !output)) {
      output = process.stdout;
    }

    ui = { input, output, ...other };
  }

  if (release.type === "prompt" && !(ui.input && ui.output)) {
    throw new Error("Cannot prompt for the version number because input or output has been disabled.");
  }

  return { release, commit, tag, push, files, cwd, interface: ui, ignoreScripts };
}

/**
 * Returns all files that match the given glob patterns.
 * An error is thrown if any pattern matches zero files.
 */
async function strictGlobMatches(files: string[], options: object): Promise<string[]> {
  // Match all glob patterns simultaneously
  let matches = await Promise.all(files.map((file) => strictGlobMatch(file, options)));

  // Get all the unique files
  let matchedFiles = new Set<string>();
  for (let match of matches) {
    for (let file of match) {
      matchedFiles.add(file);
    }
  }

  return [...matchedFiles];
}

/**
 * Returns all files that match the given glob pattern.
 * An error is thrown if the pattern matches zero files.
 */
async function strictGlobMatch(file: string, options: object): Promise<string[]> {
  let matches = await globby(file, options);

  if (matches.length === 0) {
    if (hasMagic(file)) {
      throw new Error(`Could not find any files matching "${file}".`);
    }
    else {
      throw new Error(`Could not find file: ${file}.`);
    }
  }

  // Return files in a predictable order
  return matches.sort();
}
