import * as path from "path";
import { readJsonFile, readTextFile } from "./fs";
import { isManifest } from "./manifest";
import { Options } from "./options";

type Params = Options & { oldVersion: string; newVersion: string };
type FileParams = Params & { name: string };

/**
 * Updates the version number in the specified files.
 *
 * @returns - The files that were actually modified
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
 * @returns - `true` if the file was actually modified
 */
async function updateManifestFile(params: FileParams): Promise<boolean> {
  let { name, cwd, oldVersion, newVersion } = params;

  let file = await readJsonFile(name, cwd);

  if (isManifest(file.data)) {
    // TODO: Update the file
    return true;
  }

  return false;
}

/**
 * Updates all occurrences of the version number in the specified text file.
 *
 * @returns - `true` if the file was actually modified
 */
async function updateTextFile(params: FileParams): Promise<boolean> {
  let { name, cwd, oldVersion, newVersion } = params;

  let file = await readTextFile(name, cwd);

  if (isManifest(file.data)) {
    // TODO: Update the file
    return true;
  }

  return false;
}
