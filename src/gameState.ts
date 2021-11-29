import { MessageAttachment } from "discord.js";
import { readFile, writeFile } from "fs/promises";
import store, { ReduxState } from "./store";
import { Character } from "./character/Character";
import { defaultCharacter } from "./character/defaultCharacter";
import { defaultCooldowns } from "./character/defaultCooldowns";
import { keys } from "remeda";

export const DB_FILE = "./db.redux.json";

export const defaultProfile = "attachment://profile.png";
export const defaultProfileAttachment = new MessageAttachment(
  "./images/default-profile.png",
  "profile.png"
);

export const getDBJSON = (space = 2): string =>
  JSON.stringify(store.getState(), null, space);

const isEmptyState = (state: ReduxState) =>
  keys(state.characters.charactersById).length === 0 &&
  keys(state.monsters.monstersById).length === 0 &&
  keys(state.encounters.encountersById).length === 0 &&
  keys(state.loots.lootsById).length === 0;

export const saveDB = async (file = DB_FILE): Promise<void> => {
  console.time("saveDB");
  const state = store.getState();
  if (isEmptyState(state)) return;

  debugger;
  await writeFile(file, getDBJSON(), { encoding: "utf-8" });
  console.timeEnd("saveDB");
};

export const loadDB = async (): Promise<void> => {
  console.time("loadDB");
  const data = await readFile(DB_FILE, { encoding: "utf-8" });
  loadSerializedDB(data.toString());
  console.timeEnd("loadDB");
};

export const loadSerializedDB = (serialized: string): GameState => {
  const parsed = JSON.parse(serialized);
};

export const d20 = (): number => Math.ceil(Math.random() * 20);
export const d6 = (): number => Math.ceil(Math.random() * 6);
