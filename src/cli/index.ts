// tslint:disable: no-console
import { manifest } from "../manifest";
import { versionBump } from "../version-bump";
import { VersionBumpOptions } from "../version-bump-options";
import { helpText } from "./help";
import { parseArgs } from "./parse-args";

enum ExitCode {
  Success = 0,
  SytaxError = 1,
  RuntimeError = 2,
}

/**
 * The main entry point of the CLI
 *
 * @param args - The command-line arguments (e.g. ["major", "--preid=alpha", "-ctpa"])
 */
export async function main(args: string[]): Promise<void> {
  try {
    let { help, version, options } = parseArgs(args);

    if (help) {
      // Show the help text and exit
      console.log(helpText);
      process.exit(ExitCode.Success);
    }
    else if (version) {
      // Show the version number and exit
      console.log(manifest.version);
      process.exit(ExitCode.Success);
    }
    else {
      await bump(options);
    }
  }
  catch (error) {
    // There was an error parsing the command-line args
    console.error((error as Error).message);
    console.error(helpText);
    process.exit(ExitCode.SytaxError);
  }
}

async function bump(options: VersionBumpOptions): Promise<void> {
  try {
    let results = await versionBump(options);
    console.log("\n\nRESULTS:", results, "\n\n");
  }
  catch (error) {
    console.error((error as Error).stack || (error as Error).message);
    process.exit(ExitCode.RuntimeError);
  }
}
