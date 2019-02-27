import * as semver from "semver";
import { readJsonFile } from "./fs";
import { isManifest } from "./manifest";
import { NormalizedOptions } from "./normalize-options";

/**
 * Returns the current version number from files such as package.json.
 * An error is thrown if no version number can be found.
 */
export async function getOldVersion({ files, cwd }: NormalizedOptions): Promise<string> {
  // Check all JSON files in the files list
  let filesToCheck = files.filter((file) => file.endsWith(".json"));

  // Always check package.json
  if (!filesToCheck.includes("package.json")) {
    filesToCheck.push("package.json");
  }

  // Check each file, in order, and return the first valid version number we find
  for (let file of filesToCheck) {
    let version = await readVersion(file, cwd);

    if (version) {
      return version;
    }
  }

  // If we get here, then no version number was found
  throw new Error(
    `Unable to determine the current version number. Checked ${filesToCheck.join(", ")}.`
  );
}

/**
 * Tries to read the version number from the specified JSON file.
 *
 * @returns - The version number, or undefined if the file doesn't have a version number
 */
async function readVersion(file: string, cwd: string): Promise<string | undefined> {
  try {
    let { data: manifest } = await readJsonFile(file, cwd);

    if (isManifest(manifest)) {
      if (semver.valid(manifest.version as string)) {
        return manifest.version;
      }
    }
  }
  catch (error) {
    return undefined;
  }
}
