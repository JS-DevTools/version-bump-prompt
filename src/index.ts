import { versionBump } from "./version-bump";

export { versionBump } from "./version-bump";
export { VersionBumpOptions } from "./version-bump-options";
export { VersionBumpResults } from "./version-bump-results";

// tslint:disable-next-line: no-default-export
export default versionBump;

// CommonJS default export hack
if (typeof module === "object" && typeof module.exports === "object") {
  module.exports = Object.assign(module.exports.default, module.exports);  // tslint:disable-line: no-unsafe-any
}
