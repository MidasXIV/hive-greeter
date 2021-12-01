import fs from "fs/promises";
import fsSync from "fs";
import { constants } from "fs";
import path from "path";
import mkdirp from "mkdirp";

const dbFolder = path.join(__dirname, "..", "..", "db");
const dbFile = (key: string) =>
  path.join(dbFolder, `${key.replace(":", ".")}.json`);

const ensureDB = async (key: string) => {
  mkdirp(dbFolder);
  const exists = await fs
    .access(dbFile(key), constants.F_OK)
    .then(() => true)
    .catch(() => false);
  if (!exists) return fsSync.writeFileSync(dbFile(key), "{}");
};

export const disk = {
  getItem: async (key: string): Promise<string> => {
    await ensureDB(key);
    try {
      return fs.readFile(dbFile(key)).then((d) => d.toString("utf-8"));
    } catch (e) {
      return Promise.resolve("{}");
    }
  },
  setItem: async (key: string, item: string): Promise<void> => {
    await ensureDB(key);
    return fs.writeFile(dbFile(key), JSON.stringify(JSON.parse(item), null, 2));
  },
  removeItem: async (key: string): Promise<void> => {
    await ensureDB(key);
    return fs.writeFile(dbFile(key), "{}");
  },
};
