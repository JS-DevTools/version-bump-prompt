import * as ezSpawn from "@jsdevtools/ez-spawn";
import { readJsonFile } from "./fs";
import { isManifest, Manifest } from "./manifest";
import { Operation } from "./operation";
import { NpmScript, ProgressEvent } from "./types/version-bump-progress";

/**
 * Runs the specified NPM script in the package.json file.
 */
export async function runNpmScript(script: NpmScript, operation: Operation): Promise<Operation> {
  let { cwd, ignoreScripts } = operation.options;

  if (!ignoreScripts) {
    let { data: manifest } = await readJsonFile("package.json", cwd);

    if (isManifest(manifest) && hasScript(manifest, script)) {
      await ezSpawn.async("npm", ["run", script, "--silent"], { stdio: "inherit" });
      operation.update({ event: ProgressEvent.NpmScript, script });
    }
  }

  return operation;
}

/**
 * Determines whether the specified NPM script exists in the given manifest.
 */
function hasScript(manifest: Manifest, script: NpmScript): boolean {
  let scripts = manifest.scripts as Record<NpmScript, string> | undefined;

  if (scripts && typeof scripts === "object") {
    return Boolean(scripts[script]);
  }

  return false;
}
