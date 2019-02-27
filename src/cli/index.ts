// tslint:disable: no-console
import { manifest } from "../manifest";
import { versionBump } from "../version-bump";
import { VersionBumpOptions } from "../version-bump-options";
import { helpText } from "./help";
import { parseArgs } from "./parse-args";

/**
 * @see https://nodejs.org/api/process.html#process_exit_codes
 */
enum ExitCode {
  Success = 0,
  FatalError = 1,
  InvalidArgument = 9,
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
    process.exit(ExitCode.InvalidArgument);
  }
}

async function bump(options: VersionBumpOptions): Promise<void> {
  try {
    await versionBump(options);
  }
  catch (error) {
    let message = (error as Error).message;

    if (process.env.DEBUG || process.env.NODE_ENV === "development") {
      message = (error as Error).stack || message;
    }

    console.error(message);
    process.exit(ExitCode.RuntimeError);
  }
}
