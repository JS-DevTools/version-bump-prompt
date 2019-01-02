// NOTE: We can't `import` the package.json file because it's outside of the "src" directory.
// tslint:disable-next-line: no-var-requires no-require-imports
const manifest = require("../package.json") as Manifest;

// Don't use the npm package name ("version-bump-prompt").
// Use the name of the binary ("bump") instead.
let name = Object.keys(manifest.bin!)[0];
const alteredManifest: Manifest = { ...manifest, name };
export { alteredManifest as manifest };

/**
 * The npm package manifest (package.json)
 */
export interface Manifest {
  name?: string;
  version: string;
  description?: string;
  bin?: Record<string, string>;
  [key: string]: unknown;
}

// tslint:disable: no-any no-unsafe-any

/**
 * Determines whether the specified object is a package manifest.
 */
export function isManifest(obj: any): obj is Manifest {
  return obj &&
    typeof obj === "object" &&
    typeof obj.version === "string";
}
