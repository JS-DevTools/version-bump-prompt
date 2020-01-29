// NOTE: We can't `import` the package.json file because it's outside of the "src" directory.
// tslint:disable-next-line: no-var-requires no-require-imports
const manifest = require("../package.json") as Manifest;

export { manifest };

/**
 * The npm package manifest (package.json)
 */
export interface Manifest {
  name: string;
  version: string;
  description: string;
  [key: string]: unknown;
}

// tslint:disable: no-any no-unsafe-any

/**
 * Determines whether the specified value is a package manifest.
 */
export function isManifest(obj: any): obj is Manifest {
  return obj &&
    typeof obj === "object" &&
    isOptionalString(obj.name) &&
    isOptionalString(obj.version) &&
    isOptionalString(obj.description);
}

/**
 * Determines whether the specified value is a string, null, or undefined.
 */
function isOptionalString(value: any): value is string | undefined {
  let type = typeof value;
  return value === null ||
    type === "undefined" ||
    type === "string";
}
