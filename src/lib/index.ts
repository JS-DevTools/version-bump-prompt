import { versionBump } from "./version-bump";

export { versionBump } from "./version-bump";
export { VersionBumpOptions } from "./version-bump-options";
export { VersionBumpResults } from "./version-bump-results";
export { isVersionBumpType, VersionBumpType } from "./version-bump-type";

// tslint:disable-next-line: no-default-export
export default versionBump;

// CommonJS default export hack
if (typeof module === "object" && typeof exports === "object") {
  module.exports = versionBump;
  Object.assign(versionBump, exports);
}
