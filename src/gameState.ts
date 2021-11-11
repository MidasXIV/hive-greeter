import { randomUUID } from "crypto";
import { MessageAttachment, User } from "discord.js";
import { readFile, writeFile } from "fs/promises";
import { Character } from "./character/Character";
import { defaultCharacter } from "./character/defaultCharacter";
import { getCharacterStatModified } from "./character/getCharacterStatModified";
import { isCharacterOnCooldown } from "./character/isCharacterOnCooldown";
import { StatusEffect } from "./statusEffects/StatusEffect";

export const DB_FILE = "./db.json";

type GameState = {
  characters: Map<string, Character>;
};

export const gameState: GameState = { characters: new Map() };

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
    },
    null,
    space
  );

export const saveDB = async (): Promise<void> => {
  const data = getDBJSON();
  await writeFile(DB_FILE, data, { encoding: "utf-8" });
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
  gameState.characters.set(characterId, {
    ...character,
    maxHP: character.maxHP + 1,
    hp: character.hp + 1,
  });
};

const purgeExpiredStatuses = (characterId: string): void => {
  const character = gameState.characters.get(characterId);
  if (!character) return;
  gameState.characters.set(characterId, {
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

export const getCharacter = (id: string): Character | void => {
  purgeExpiredStatuses(id);
  return gameState.characters.get(id);
};

export const updateCharacter = (
  character: Character | void
): Character | void => {
  if (!character) return;
  gameState.characters.set(character.id, character);
  return gameState.characters.get(character.id);
};

export const getUserCharacter = (user: User): Character => {
  purgeExpiredStatuses(user.id);
  const character = gameState.characters.get(user.id);
  if (!character) {
    return createCharacter({
      id: user.id,
      name: user.username,
      profile: user.avatarURL() || defaultProfile,
      user,
    });
  }
  return character;
};

export const setCharacterCooldown = (
  characterId: string,
  type: keyof Character["cooldowns"]
): Character | void => {
  const character = getCharacter(characterId);
  if (!character) return;
  const updatedCharacter = {
    ...character,
    cooldowns: { ...character.cooldowns, [type]: new Date().toString() },
  };
  gameState.characters.set(characterId, updatedCharacter);
  return getCharacter(characterId);
};

const cooldowns: { [key in keyof Character["cooldowns"]]: number } = {
  renew: 120,
};

export const getCooldownRemaining = (
  characterId: string,
  type: keyof Character["cooldowns"]
): number => {
  try {
    const cooldown = cooldowns[type] ?? 5;
    const lastUsed = gameState.characters.get(characterId)?.cooldowns[type];
    if (!lastUsed) return 0;
    return new Date(lastUsed).valueOf() + cooldown - Date.now();
  } catch (e) {
    console.error(`failed to getCooldownRemaining for user ${characterId}`);
    return 0;
  }
};
export const createCharacter = (
  character: Partial<Character> & { name: string }
): Character => {
  const newCharacter: Character = {
    ...defaultCharacter,
    id: character?.id ?? randomUUID(),
    ...character,
  };
  gameState.characters.set(newCharacter.id, newCharacter);
  console.log(`created ${newCharacter.id}`);
  return newCharacter;
};

export const awardXP = (
  characterId: string,
  amount: number
): Character | void => {
  const character = getCharacter(characterId);
  if (!character) return undefined;
  gameState.characters.set(characterId, {
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
  gameState.characters.set(characterId, {
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
  gameState.characters.set(characterId, {
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
  gameState.characters.set(id, { ...character, profile: url });
  return character;
};
