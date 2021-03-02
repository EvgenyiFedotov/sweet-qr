import * as fs from "fs";
import * as path from "path";

const pathFile = path.resolve(process.cwd(), "./qrs.json");
let data: Record<string, any>;

const writeData = () => {
  fs.writeFileSync(pathFile, JSON.stringify(data));
};

export const write = (key: string, value: any) => {
  data[key] = value;
  writeData();
};

export const read = (key: string): any => {
  return data[key] ?? null;
};

export const remove = (key: string) => {
  delete data[key];
  writeData();
};

if (fs.existsSync(pathFile)) {
  data = JSON.parse(fs.readFileSync(pathFile).toString());
} else {
  data = {};
  writeData();
}

if (typeof data !== 'object') {
  throw new Error("Error of data");
}
