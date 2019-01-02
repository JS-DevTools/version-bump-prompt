import { ReadLineOptions } from "readline";
import { VersionBumpOptions } from "./version-bump-options";
import { VersionBumpType } from "./version-bump-type";

/**
 * Normalized and sanitized options
 */
export class Options {
  public version: string;
  public preid: string;
  public commit: boolean;
  public commitMessage: string;
  public tag: boolean;
  public tagName: string;
  public push: boolean;
  public all: boolean;
  public files: string[];
  public cwd: string;
  public interface: ReadLineOptions;

  public constructor(props: VersionBumpOptions) {
    let { version, preid, commit, tag, push, all, files, cwd } = props;

    this.version = version || VersionBumpType.Prompt;
    this.preid = typeof preid === "string" ? preid : "beta";
    this.push = Boolean(push);
    this.all = Boolean(all);
    this.cwd = cwd || process.cwd();
    this.interface = {
      input: process.stdin,
      output: process.stdout,
      ...props.interface,
    };

    if (typeof tag === "string") {
      this.tag = true;
      this.tagName = tag;
    }
    else if (tag) {
      this.tag = true;
      this.tagName = "v";
    }
    else {
      this.tag = false;
      this.tagName = "";
    }

    if (typeof commit === "string") {
      this.commit = true;
      this.commitMessage = commit;
    }
    else if (commit || this.tag || this.push) {
      this.commit = true;
      this.commitMessage = "release v";
    }
    else {
      this.commit = false;
      this.commitMessage = "";
    }

    if (Array.isArray(files) && files.length > 0) {
      this.files = files.slice();
    }
    else {
      this.files = ["package.json", "package-lock.json"];
    }
  }
}
