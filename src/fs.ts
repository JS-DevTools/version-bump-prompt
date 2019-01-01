import * as fs from "fs";

/**
 * Reads a text file and returns its contents.
 */
export function readTextFile(file: string): Promise<string> { // tslint:disable-line: promise-function-async
  return new Promise((resolve, reject) => {
    // tslint:disable-next-line ban
    fs.readFile(file, "utf8", (err, text) => {
      if (err) {
        reject(err);
      }
      else {
        resolve(text);
      }
    });
  });
}

/**
 * Reads a JSON file and returns the parsed data.
 */
export async function readJsonFile(file: string): Promise<unknown> {
  let json = await readTextFile(file);
  let pojo = JSON.parse(json) as unknown;

  return pojo;
}
