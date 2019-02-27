import * as path from "path";
import { readJsonFile, readTextFile, writeJsonFile, writeTextFile } from "./fs";
import { isManifest } from "./manifest";
import { NormalizedOptions } from "./normalize-options";

type Params = NormalizedOptions & { oldVersion: string; newVersion: string };
type FileParams = Params & { name: string };

/**
 * Updates the version number in the specified files.
 *
 * @returns - The relative paths of the files that were actually modified
 */
export async function updateFiles(params: Params): Promise<string[]> {
  let { files } = params;
  let modifiedFiles = [];

  for (let name of files) {
    let modified = await updateFile({ ...params, name });

    if (modified) {
      modifiedFiles.push(name);
    }
  }

  return modifiedFiles;
}

/**
 * Updates the version number in the specified file.
 *
 * @returns - `true` if the file was actually modified
 */
async function updateFile(params: FileParams): Promise<boolean> {
  let { name } = params;
  name = path.basename(name).trim().toLowerCase();

  switch (name) {
    case "package.json":
    case "package-lock.json":
    case "bower.json":
    case "component.json":
      return updateManifestFile(params);

    default:
      return updateTextFile(params);
  }
}

/**
 * Updates the version number in the specified JSON manifest file.
 *
 * NOTE: Unlike text files, this is NOT a global find-and-replace.  It _specifically_ sets
 * the top-level `version` property.
 *
 * @returns - `true` if the file was actually modified
 */
async function updateManifestFile(params: FileParams): Promise<boolean> {
  let { name, cwd, newVersion } = params;
  let modified = false;

  try {
    let file = await readJsonFile(name, cwd);

    if (isManifest(file.data) && file.data.version !== newVersion) {
      file.data.version = newVersion;
      await writeJsonFile(file);
      modified = true;
    }
  }
  catch (error) {
    // Ignore nonexistent files
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
  }

  return modified;
}

/**
 * Updates all occurrences of the version number in the specified text file.
 *
 * @returns - `true` if the file was actually modified
 */
async function updateTextFile(params: FileParams): Promise<boolean> {
  let { name, cwd, oldVersion, newVersion } = params;
  let modified = false;

  try {
    let file = await readTextFile(name, cwd);

    // Only update the file if it contains at least one occurrence of the old version
    if (file.data.includes(oldVersion)) {
      // Escape all non-alphanumeric characters in the version
      let sanitizedVersion = oldVersion.replace(/(\W)/g, "\\$1");

      // Replace occurrences of the old version number that are surrounded by word boundaries.
      // This ensures that it matches "1.23.456" or "v1.23.456", but not "321.23.456".
      let replacePattern = new RegExp("(\\b|v)" + sanitizedVersion + "\\b", "g");

      file.data = file.data.replace(replacePattern, "$1" + newVersion);
      await writeTextFile(file);

      return true;
    }
  }
  catch (error) {
    // Ignore nonexistent files
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
  }

  return modified;
}
