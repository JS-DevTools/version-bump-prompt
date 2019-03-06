import * as path from "path";
import { readJsonFile, readTextFile, writeJsonFile, writeTextFile } from "./fs";
import { isManifest } from "./manifest";
import { Operation } from "./operation";
import { ProgressEvent } from "./types/version-bump-progress";

/**
 * Updates the version number in the specified files.
 */
export async function updateFiles(operation: Operation): Promise<Operation> {
  let { files } = operation.options;

  for (let relPath of files) {
    let modified = await updateFile(relPath, operation);

    if (modified) {
      operation.update({
        event: ProgressEvent.FileUpdated,
        files: [relPath],
      });
    }
  }

  return operation;
}

/**
 * Updates the version number in the specified file.
 *
 * @returns - `true` if the file was actually modified
 */
async function updateFile(relPath: string, operation: Operation): Promise<boolean> {
  let name = path.basename(relPath).trim().toLowerCase();

  switch (name) {
    case "package.json":
    case "package-lock.json":
    case "bower.json":
    case "component.json":
      return updateManifestFile(relPath, operation);

    default:
      return updateTextFile(relPath, operation);
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
async function updateManifestFile(relPath: string, operation: Operation): Promise<boolean> {
  let { cwd } = operation.options;
  let { newVersion } = operation.state;
  let modified = false;

  let file = await readJsonFile(relPath, cwd);

  if (isManifest(file.data) && file.data.version !== newVersion) {
    file.data.version = newVersion;
    await writeJsonFile(file);
    modified = true;
  }

  return modified;
}

/**
 * Updates all occurrences of the version number in the specified text file.
 *
 * @returns - `true` if the file was actually modified
 */
async function updateTextFile(relPath: string, operation: Operation): Promise<boolean> {
  let { cwd } = operation.options;
  let { oldVersion, newVersion } = operation.state;
  let modified = false;

  let file = await readTextFile(relPath, cwd);

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

  return modified;
}
