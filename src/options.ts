import { ReadLineOptions } from "readline";
import { isReleaseType, ReleaseType } from "./release-type";
import { VersionBumpOptions } from "./version-bump-options";

interface Interface extends ReadLineOptions {
  output: NodeJS.WritableStream;
}

/**
 * Normalized and sanitized options
 */
export class Options {
  public release: "prompt" | ReleaseType | { version: string };
  public preid: string;
  public commit?: {
    message: string;
  };
  public tag?: {
    name: string;
  };
  public push: boolean;
  public all: boolean;
  public files: string[];
  public cwd: string;
  public interface: Interface;

  public constructor(props: VersionBumpOptions) {
    let { release, preid, commit, tag, push, all, files, cwd } = props;

    // Set the simple properties first
    this.preid = typeof preid === "string" ? preid : "beta";
    this.push = Boolean(push);
    this.all = Boolean(all);
    this.cwd = cwd || process.cwd();
    this.interface = {
      input: process.stdin,
      output: process.stdout,
      ...props.interface,
    };

    // release
    if (!release || release === "prompt") {
      this.release = "prompt";
    }
    else if (isReleaseType(release)) {
      this.release = release;
    }
    else {
      this.release = { version: release };
    }

    // tag
    if (typeof tag === "string") {
      this.tag = { name: tag };
    }
    else if (tag) {
      this.tag = { name: "v" };
    }

    // commit  - This must come AFTER tag, because it relies on it
    if (typeof commit === "string") {
      this.commit = { message: commit };
    }
    else if (commit || this.tag || this.push) {
      this.commit = { message: "release v" };
    }

    // files
    if (Array.isArray(files) && files.length > 0) {
      this.files = files.slice();
    }
    else {
      this.files = ["package.json", "package-lock.json"];
    }
  }
}
