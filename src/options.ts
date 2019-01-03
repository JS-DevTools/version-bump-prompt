import * as globby from "globby";
import { ReadLineOptions } from "readline";
import { isReleaseType, ReleaseType } from "./release-type";
import { VersionBumpOptions } from "./version-bump-options";

interface Interface extends ReadLineOptions {
  output: NodeJS.WritableStream;
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
    let ui = {
      input: process.stdin,
      output: process.stdout,
      ...raw.interface,
    };

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

    return new Options({
      release, preid, commit, tag, push, all, files, cwd, interface: ui
    });
  }
}
