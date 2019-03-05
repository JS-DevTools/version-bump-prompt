// tslint:disable: no-default-export
import { versionBump } from "./version-bump";

// Exprot the external type definitions as named exports
export { ReleaseType } from "./release-type";
export * from "./version-bump-options";
export * from "./version-bump-results";
export * from "./version-bump-progress";

// Export `versionBump` as a named export and the default export
export { versionBump };
export default versionBump;

// CommonJS default export hack
if (typeof module === "object" && typeof module.exports === "object") {
  module.exports = Object.assign(module.exports.default, module.exports);  // tslint:disable-line: no-unsafe-any
}
