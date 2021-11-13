import { MessageAttachment } from "discord.js";
import { readFile, writeFile } from "fs/promises";
import { Character } from "./character/Character";
import { defaultCharacter } from "./character/defaultCharacter";
import { getCharacterStatModified } from "./character/getCharacterStatModified";
import { isCharacterOnCooldown } from "./character/isCharacterOnCooldown";
import { getCharacter } from "./character/getCharacter";
import { StatusEffect } from "./statusEffects/StatusEffect";
import { Monster } from "./monster/Monster";
import { setCharacterCooldown } from "./setCharacterCooldown";

export const DB_FILE = "./db.json";

type GameState = {
  characters: Map<string, Character>;
  monsters: Map<string, Monster>;
};

export const gameState: GameState = {
  characters: new Map(),
  monsters: new Map(),
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
    },
    null,
    space
  );

const isEmptyState = (state: GameState) => state.characters.size === 0;

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

const isStatusEffectExpired = (effect: StatusEffect): boolean =>
  Date.now() > new Date(effect.started).valueOf() + effect.duration;

export const getUserCharacters = (): Character[] =>
  Array.from(gameState.characters.values()).filter(
    (character) => character.user
  );

export const updateCharacter = (
  character: Character | void
): Character | void => {
  if (!character) return;
  gameState.characters.set(character.id, character);
  return gameState.characters.get(character.id);
};
const cooldowns: { [key in keyof Character["cooldowns"]]: number } = {
  renew: 120 * 60000,
};

export const getCooldownRemaining = (
  characterId: string,
  type: keyof Character["cooldowns"]
): number => {
  try {
    const cooldown = cooldowns[type] ?? 5 * 60000;
    const lastUsed = gameState.characters.get(characterId)?.cooldowns[type];
    if (!lastUsed) return 0;
    const remaining = new Date(lastUsed).valueOf() + cooldown - Date.now();
    if (remaining < 0) return 0;
    return remaining;
  } catch (e) {
    console.error(`failed to getCooldownRemaining for user ${characterId}`);
    return 0;
  }
};
export const awardXP = (
  characterId: string,
  amount: number
): Character | void => {
  const character = getCharacter(characterId);
  if (!character) return undefined;
  updateCharacter({
    ...character,
    xp: character.xp + amount,
  });
  return getCharacter(characterId);
};

export const adjustGold = (
  characterId: string,
  amount: number
): Character | void => {
  const character = getCharacter(characterId);
  if (!character) return;
  updateCharacter({
    ...character,
    gold: character.gold + amount,
  });
  return getCharacter(characterId);
};

export const setGold = (
  characterId: string,
  amount: number
): Character | void => {
  const character = getCharacter(characterId);
  if (!character) return;
  updateCharacter({
    ...character,
    gold: amount,
  });
  return getCharacter(characterId);
};

export const adjustHP = (
  characterId: string,
  amount: number
): Character | void => {
  const character = getCharacter(characterId);
  if (!character) return;
  updateCharacter(adjustCharacterHP(character, amount));
  return getCharacter(characterId);
};
export const adjustCharacterHP = (
  character: Character,
  amount: number
): Character => {
  const maxHP = getCharacterStatModified(character, "maxHP");
  let newHp = character.hp + amount;
  if (newHp < 0) newHp = 0;
  if (newHp > maxHP) newHp = maxHP;
  return {
    ...character,
    hp: newHp,
  };
};

export const d20 = (): number => Math.ceil(Math.random() * 20);
export const d6 = (): number => Math.ceil(Math.random() * 6);

export type TrapResult =
  | {
      outcome: "hit";
      attackRoll: number;
      attackBonus: number;
      damage: number;
      defender: Character;
    }
  | {
      outcome: "miss";
      attackRoll: number;
      attackBonus: number;
      damage: number;
      defender: Character;
    };
type HealResult =
  | { outcome: "healed"; amount: number; target: Character }
  | { outcome: "cooldown" };

export const heal = (
  initiatorId: string,
  targetId: string
): HealResult | undefined => {
  if (isCharacterOnCooldown(initiatorId, "heal"))
    return { outcome: "cooldown" };
  const healer = getCharacter(initiatorId);
  getCharacter(targetId);
  if (!healer) return;
  setCharacterCooldown(healer.id, "heal");
  const amount = d6();
  adjustHP(targetId, amount);
  const target = getCharacter(targetId);
  if (!target) return;
  return { outcome: "healed", amount, target };
};

export const setProfile = (id: string, url: string): Character | void => {
  const character = getCharacter(id);
  if (!character) return;
  updateCharacter({ ...character, profile: url });
  return character;
};
