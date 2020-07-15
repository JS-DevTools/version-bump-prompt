// NOTE: We can't `import` the package.json file because it's outside of the "src" directory.
// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
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
