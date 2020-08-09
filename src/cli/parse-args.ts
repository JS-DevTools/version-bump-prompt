import * as commandLineArgs from "command-line-args";
import * as semver from "semver";
import { isReleaseType } from "../release-type";
import { VersionBumpOptions } from "../types/version-bump-options";
import { ExitCode } from "./exit-code";
import { usageText } from "./help";

/**
 * The parsed command-line arguments
 */
export interface ParsedArgs {
  help?: boolean;
  version?: boolean;
  quiet?: boolean;
  options: VersionBumpOptions;
}

/**
 * Parses the command-line arguments
 */
export function parseArgs(argv: string[]): ParsedArgs {
  try {
    let args = commandLineArgs(
      [
        { name: "preid", type: String },
        { name: "commit", alias: "c", type: String },
        { name: "tag", alias: "t", type: String },
        { name: "push", alias: "p", type: Boolean },
        { name: "all", alias: "a", type: Boolean },
        { name: "no-verify", type: Boolean },
        { name: "quiet", alias: "q", type: Boolean },
        { name: "version", alias: "v", type: Boolean },
        { name: "help", alias: "h", type: Boolean },
        { name: "ignore-scripts", type: Boolean },
        { name: "files", type: String, multiple: true, defaultOption: true },
      ],
      { argv }
    );

    let parsedArgs: ParsedArgs = {
      help: args.help as boolean,
      version: args.version as boolean,
      quiet: args.quiet as boolean,
      options: {
        preid: args.preid as string,
        commit: args.commit as string | boolean,
        tag: args.tag as string | boolean,
        push: args.push as boolean,
        all: args.all as boolean,
        noVerify: args["no-verify"] as boolean,
        files: args.files as string[],
        ignoreScripts: args["ignore-scripts"] as boolean,
      }
    };

    // If --preid is used without an argument, then throw an error, since it's probably a mistake.
    // If they want to use the default value ("beta"), then they should not pass the argument at all
    if (args.preid === null) {
      throw new Error("The --preid option requires a value, such as \"alpha\", \"beta\", etc.");
    }

    // If --commit is used without an argument, then treat it as a boolean flag
    if (args.commit === null) {
      parsedArgs.options.commit = true;
    }

    // If --tag is used without an argument, then treat it as a boolean flag
    if (args.tag === null) {
      parsedArgs.options.tag = true;
    }

    // If a version number or release type was specified, then it will mistakenly be added to the "files" array
    if (parsedArgs.options.files && parsedArgs.options.files.length > 0) {
      let firstArg = parsedArgs.options.files[0];

      if (firstArg === "prompt" || isReleaseType(firstArg) || semver.valid(firstArg)) {
        parsedArgs.options.release = firstArg;
        parsedArgs.options.files.shift();
      }
    }

    return parsedArgs;
  }
  catch (error) {
    // There was an error parsing the command-line args
    return errorHandler(error as Error);
  }
}

function errorHandler(error: Error): never {
  console.error(error.message);
  console.error(usageText);
  return process.exit(ExitCode.InvalidArgument);
}
