import { readFileSync } from "fs";
import { join } from "path";
import { MonsterKind } from "../getRandomMonsterName";

const readSingleColumnCSV = (file: string) =>
  readFileSync(join(__dirname, file))
    .toLocaleString()
    .replace(/\r/g, "")
    .split("\n");

export const namesByKind = new Map<MonsterKind, string[]>([
  ["Goblin", readSingleColumnCSV("goblin_names.csv")],
  ["Orc", readSingleColumnCSV("orc_names.csv")],
  ["Bandit", readSingleColumnCSV("bandit_names.csv")],
]);
