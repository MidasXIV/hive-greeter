import { MessageAttachment } from "discord.js";
import { readFile, writeFile } from "fs/promises";
import { Character } from "./character/Character";
import { defaultCharacter } from "./character/defaultCharacter";
import { getCharacter } from "./character/getCharacter";
import { Monster } from "./monster/Monster";
import { updateCharacter } from "./character/updateCharacter";
import { LootResult } from "./character/loot/loot";
import { defaultCooldowns } from "./character/defaultCooldowns";
import { isStatusEffectExpired } from "./isStatusEffectExpired";

export const DB_FILE = "./db.json";

type GameState = {
  characters: Map<string, Character>;
  monsters: Map<string, Monster>;
  loots: Map<string, LootResult>;
  cooldowns: typeof defaultCooldowns;
};

export const gameState: GameState = {
  characters: new Map(),
  monsters: new Map(),
  loots: new Map(),
  cooldowns: defaultCooldowns,
};

export const defaultProfile = "attachment://profile.png";
export const defaultProfileAttachment = new MessageAttachment(
  "./images/default-profile.png",
  "profile.png"
);

export const getDBJSON = (space = 2): string =>
  JSON.stringify(
    {
      lastSave: new Date().toString(),
      characters: Array.from(gameState.characters.entries()),
      monsters: Array.from(gameState.monsters.entries()),
      cooldowns: gameState.cooldowns,
    },
    null,
    space
  );

const isEmptyState = (state: GameState) =>
  state.characters.size === 0 &&
  state.monsters.size === 0 &&
  state.loots.size === 0;

export const saveDB = async (file = DB_FILE): Promise<void> => {
  console.log("saving db");
  if (isEmptyState(gameState)) return;
  const data = getDBJSON();
  await writeFile(file, data, { encoding: "utf-8" });
};

export const loadDB = async (): Promise<void> => {
  const data = await readFile(DB_FILE, { encoding: "utf-8" });
  loadSerializedDB(data.toString());
};

export const loadSerializedDB = (serialized: string): GameState => {
  const parsed = JSON.parse(serialized);
  const characters = parsed.characters.map(
    ([id, character]: [string, Character]) => [
      id,
      {
        ...defaultCharacter,
        ...character,
      },
    ]
  );
  const characterMap = new Map<string, Character>(characters);
  gameState.characters = characterMap;
  console.log("Database loaded", gameState);
  return gameState;
};

export const grantDivineBlessing = (characterId: string): void => {
  const character = getCharacter(characterId);
  if (!character) return;
  updateCharacter({
    ...character,
    maxHP: character.maxHP + 1,
    hp: character.hp + 1,
  });
};

export const purgeExpiredStatuses = (characterId: string): void => {
  const character = gameState.characters.get(characterId);
  if (!character) return;
  updateCharacter({
    ...character,
    statusEffects:
      character.statusEffects?.filter(
        (effect) => !isStatusEffectExpired(effect)
      ) ?? [],
  });
  console.log(`${characterId} status effects purged`);
};

export const d20 = (): number => Math.ceil(Math.random() * 20);
export const d6 = (): number => Math.ceil(Math.random() * 6);
