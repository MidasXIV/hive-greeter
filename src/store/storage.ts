import fs from "fs/promises";
import fsSync from "fs";
import { constants } from "fs";
import path from "path";
import mkdirp from "mkdirp";

const dbFolder = path.join(__dirname, "..", "..", "db");
const dbFile = path.join(dbFolder, `db.json`);

const ensureDB = async () => {
  mkdirp(dbFolder);
  const exists = await fs
    .access(dbFile, constants.F_OK)
    .then(() => true)
    .catch(() => false);
  if (!exists) return fsSync.writeFileSync(dbFile, "{}");
};

export const disk = {
  getItem: async (): Promise<string> => {
    await ensureDB();
    try {
      return fs.readFile(dbFile).then((d) => d.toString("utf-8"));
    } catch (e) {
      return Promise.resolve("{}");
    }
  },
  setItem: async (_: string, item: string): Promise<void> => {
    await ensureDB();
    return fs.writeFile(dbFile, JSON.stringify(JSON.parse(item), null, 2));
  },
  removeItem: async (): Promise<void> => {
    await ensureDB();
    return fs.writeFile(dbFile, "{}");
  },
};
