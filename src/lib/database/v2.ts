import * as fs from "fs";

export const useFile = <Item>(pathFile: string) => {
  let data: Record<string, Item>;

  const writeData = () => {
    fs.writeFileSync(pathFile, JSON.stringify(data));
  };

  const write = (key: string, item: Item) => {
    data[key] = item;
    writeData();
  };

  const read = (key: string): Item | null => {
    return data[key] ?? null;
  };

  const remove = (key: string) => {
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

  return { write, read, remove };
};
