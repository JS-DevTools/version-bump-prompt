import * as detectIndent from "detect-indent";
import * as detectNewline from "detect-newline";
import * as fs from "fs";
import * as path from "path";

/**
 * Describes a plain-text file.
 */
export interface TextFile {
  path: string;
  data: string;
}

/**
 * Describes a JSON file.
 */
interface JsonFile {
  path: string;
  data: unknown;
  indent: string;
  newline: string | undefined;
}

/**
 * Reads a JSON file and returns the parsed data.
 */
export async function readJsonFile(name: string, cwd: string): Promise<JsonFile> {
  let file = await readTextFile(name, cwd);
  let data = JSON.parse(file.data) as unknown;
  let indent = detectIndent(file.data).indent;
  let newline = detectNewline(file.data);

  return { ...file, data, indent, newline };
}

/**
 * Writes the given data to the specified JSON file.
 */
export async function writeJsonFile(file: JsonFile): Promise<void> {
  let json = JSON.stringify(file.data, undefined, file.indent);

  if (file.newline) {
    json += file.newline;
  }

  return writeTextFile({ ...file, data: json });
}

/**
 * Reads a text file and returns its contents.
 */
export function readTextFile(name: string, cwd: string): Promise<TextFile> {
  return new Promise((resolve, reject) => {
    let filePath = path.join(cwd, name);

    fs.readFile(filePath, "utf8", (err, text) => {
      if (err) {
        reject(err);
      }
      else {
        resolve({
          path: filePath,
          data: text,
        });
      }
    });
  });
}

/**
 * Writes the given text to the specified file.
 */
export function writeTextFile(file: TextFile): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.writeFile(file.path, file.data, (err) => {
      if (err) {
        reject(err);
      }
      else {
        resolve();
      }
    });
  });
}
