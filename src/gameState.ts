import { MessageAttachment } from "discord.js";
import { readFile, writeFile } from "fs/promises";
import { Character } from "./character/Character";
import { defaultCharacter } from "./character/defaultCharacter";
import { defaultCooldowns } from "./character/defaultCooldowns";
import { LootResult } from "./character/loot/loot";
import { Encounter } from "./monster/Encounter";
import { Monster } from "./monster/Monster";

import store from './store'

export const DB_FILE = "./db.json";

type GameState = {
  characters: Map<string, Character>;
  monsters: Map<string, Monster>;
  loots: Map<string, LootResult>;
  encounters: Map<string, Encounter>;
  cooldowns: typeof defaultCooldowns;
  isHeavyCrownInPlay: boolean;
};

export const gameState: GameState = {
  characters: new Map(),
  monsters: new Map(),
  encounters: new Map(),
  cooldowns: defaultCooldowns,
  loots: new Map(),
  isHeavyCrownInPlay: false,
};

export const defaultProfile = "attachment://profile.png";
export const defaultProfileAttachment = new MessageAttachment(
  "./images/default-profile.png",
  "profile.png"
);

export const getDBJSON = (space = 2): string =>
  JSON.stringify(
    {
      ...gameState,
      lastSave: new Date().toString(),
      characters: Array.from(gameState.characters.entries()),
      monsters: Array.from(gameState.monsters.entries()),
      loots: Array.from(gameState.loots.entries()),
      encounters: Array.from(gameState.encounters.entries()),
    },
    null,
    space
  );

const isEmptyState = (state: GameState) =>
  state.characters.size === 0 &&
  state.monsters.size === 0 &&
  state.encounters.size === 0 &&
  state.loots.size === 0;

export const saveDB = async (file = DB_FILE): Promise<void> => {
  console.time("saveDB");
  if (isEmptyState(gameState)) return;
  const data = getDBJSON();
  await writeFile(file, data, { encoding: "utf-8" });
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

  gameState.characters = new Map<string, Character>(
    parsed.characters.map(([id, character]: [string, Character]) => [
      id,
      {
        ...defaultCharacter,
        ...character,
      },
    ])
  );
  gameState.monsters = new Map(parsed.monsters);
  gameState.encounters = new Map(parsed.encounters);
  gameState.loots = new Map(parsed.loots);
  gameState.cooldowns = parsed.cooldowns || defaultCooldowns;
  console.log("Database loaded");
  return gameState;
};

export const d20 = (): number => Math.ceil(Math.random() * 20);
export const d6 = (): number => Math.ceil(Math.random() * 6);
