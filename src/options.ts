import { VersionBumpOptions } from "./version-bump-options";

/**
 * Normalized and sanitized options
 */
export class Options {
  public version: string;
  public preid: string;
  public commit: boolean;
  public commitMessage?: string;
  public tag: boolean;
  public tagName?: string;
  public push: boolean;
  public all: boolean;
  public files: string[];

  public constructor(props: VersionBumpOptions) {
    this.version = props.version || "prompt";
    this.preid = props.preid || "beta";
    this.push = Boolean(props.push);
    this.all = Boolean(props.all);
    this.files = Array.isArray(props.files) ? props.files : ["package.json", "package-lock.json"];

    if (typeof props.tag === "string") {
      this.tag = true;
      this.tagName = props.tag;
    }
    else if (props.tag) {
      this.tag = true;
      this.tagName = "v";
    }
    else {
      this.tag = false;
    }

    if (typeof props.commit === "string") {
      this.commit = true;
      this.commitMessage = props.commit;
    }
    else if (props.commit || this.tag || this.push) {
      this.commit = true;
      this.commitMessage = "release v";
    }
    else {
      this.commit = false;
    }
  }
}
