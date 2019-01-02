import * as path from "path";
import * as semver from "semver";
import { Manifest } from "./cli/manifest";
import { readJsonFile } from "./fs";
import { Options } from "./options";

/**
 * Returns the current version number from files such as package.json.
 * An error is thrown if no version number can be found.
 */
export async function getOldVersion({ files, cwd }: Options): Promise<string> {
  // Check all JSON files in the files list
  let filesToCheck = files.filter((file) => file.endsWith(".json"));

  // Always check package.json
  if (!filesToCheck.includes("package.json")) {
    filesToCheck.push("package.json");
  }

  // Check each file, in order, and return the first valid version number we find
  for (let file of filesToCheck) {
    file = path.join(cwd, file);
    let version = await readVersion(file);

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
async function readVersion(file: string): Promise<string | undefined> {
  try {
    let pojo = await readJsonFile(file);

    if (typeof pojo === "object" && pojo !== null && "version" in pojo) {
      let manifest = pojo as Manifest;
      if (semver.valid(manifest.version)) {
        return manifest.version;
      }
    }
  }
  catch (error) {
    return undefined;
  }
}
