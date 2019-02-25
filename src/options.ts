import * as globby from "globby";
import { isReleaseType, ReleaseType } from "./release-type";
import { VersionBumpOptions } from "./version-bump-options";

interface Interface {
  input?: NodeJS.ReadableStream | NodeJS.ReadStream | false;
  output?: NodeJS.WritableStream | NodeJS.WriteStream | false;
  [key: string]: unknown;
}

type Release = "prompt" | ReleaseType | { version: string };

/**
 * Normalized and sanitized options
 */
export class Options {
  public release!: Release;
  public preid!: string;
  public commit?: {
    message: string;
  };
  public tag?: {
    name: string;
  };
  public push!: boolean;
  public all!: boolean;
  public files!: string[];
  public cwd!: string;
  public interface!: Interface;

  private constructor(props: Readonly<Options>) {
    Object.assign(this, props);

    if (this.release === "prompt" && !(this.interface.input && this.interface.output)) {
      throw new Error(`Cannot prompt for the version number because input or output has been disabled.`);
    }
  }

  /**
   * Converts raw VersionBumpOptions to a normalized and sanitized Options object.
   */
  public static async normalize(raw: VersionBumpOptions): Promise<Options> {
    // Set the simple properties first
    let preid = typeof raw.preid === "string" ? raw.preid : "beta";
    let push = Boolean(raw.push);
    let all = Boolean(raw.all);
    let cwd = raw.cwd || process.cwd();

    let release: Release;
    if (!raw.release || raw.release === "prompt") {
      release = "prompt";
    }
    else if (isReleaseType(raw.release)) {
      release = raw.release;
    }
    else {
      release = { version: raw.release };
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
      commit = { message: raw.commit };
    }
    else if (raw.commit || tag || push) {
      commit = { message: "release v" };
    }

    let files;
    if (Array.isArray(raw.files) && raw.files.length > 0) {
      files = await globby(raw.files, { cwd });
    }
    else {
      files = ["package.json", "package-lock.json"];
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

    return new Options({
      release, preid, commit, tag, push, all, files, cwd, interface: ui
    });
  }
}
