import { randomUUID } from "crypto";
import { User } from "discord.js";
import { readFile, writeFile } from "fs/promises";

export const DB_FILE = "./db.json";

export type Character = {
  id: string;
  name: string;
  hp: number;
  maxHP: number;
  ac: number;
  lastAction?: Date;
  level: number;
  attackBonus: number;
  profile: string;
  user?: User;
  lastEncounter?: Date;
};

type DB = {
  characters: Map<string, Character>;
};

const db: DB = { characters: new Map() };

export const getDBJSON = (space = 2): string =>
  JSON.stringify(
    {
      characters: Array.from(db.characters.entries()),
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

export const loadSerializedDB = (serialized: string): DB => {
  db.characters.clear();
  db.characters = new Map(JSON.parse(serialized).characters);
  return db;
};

const defaultProfile = "attachment://profile.png";

export const getDB = (): DB => db;

export const getHP = (characterId: string): number | undefined =>
  getCharacter(characterId)?.hp;
export const getMaxHP = (characterId: string): number | undefined =>
  getCharacter(characterId)?.maxHP;

export const grantDivineBlessing = (characterId: string): void => {
  const character = getCharacter(characterId);
  if (!character) return;
  db.characters.set(characterId, {
    ...character,
    maxHP: character.maxHP + 1,
    hp: character.hp + 1,
  });
};

export const getCharacter = (
  id: string
): ReturnType<typeof db.characters.get> => db.characters.get(id);

export const getUserCharacter = (user: User): Character => {
  const character = db.characters.get(user.id);
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
  characterId: string
): Character | undefined => {
  const character = getCharacter(characterId);
  if (!character) return;
  db.characters.set(characterId, { ...character, lastAction: new Date() });
  return character;
};

export const isCharacterOnCooldown = (
  characterId: string,
  type: "action" | "encounter" = "action"
): boolean => (getCooldownRemaining(characterId, type) ?? 0) > 0;

export const getCooldownRemaining = (
  characterId: string,
  type: "action" | "encounter" = "action"
): number | undefined => {
  const cooldown = 0;
  const character = db.characters.get(characterId);
  if (!character) return undefined;
  const last = character[type === "action" ? "lastAction" : "lastEncounter"];
  if (!last) return;
  return last.valueOf() + cooldown - Date.now();
};
export const createCharacter = (
  character: Partial<Character> & { name: string }
): Character => {
  const newCharacter: Character = {
    profile: defaultProfile,
    ...character,
    id: character?.id || randomUUID(),
    hp: 10,
    ac: 10,
    maxHP: 10,
    level: 1,
    attackBonus: 1,
  };
  db.characters.set(newCharacter.id, newCharacter);
  console.log(`created ${newCharacter.id}`);
  return newCharacter;
};

export const adjustHP = (
  characterId: string,
  amount: number
): Character | undefined => {
  const character = getCharacter(characterId);
  if (!character) return;

  let newHp = character.hp + amount;
  if (newHp < 0) newHp = 0;
  if (newHp > character.maxHP) newHp = character.maxHP;

  db.characters.set(characterId, {
    ...character,
    hp: newHp,
  });
  return getCharacter(characterId);
};

export const d20 = (): number => Math.ceil(Math.random() * 20);
export const d6 = (): number => Math.ceil(Math.random() * 6);

type AttackHit = {
  outcome: "hit";
  attacker: Character;
  defender: Character;
  attackRoll: number;
  damage: number;
};
type AttackMiss = {
  outcome: "miss";
  attacker: Character;
  defender: Character;
  attackRoll: number;
  damage: number;
};
type AttackCooldown = { outcome: "cooldown" };
type AttackResult = AttackHit | AttackMiss | AttackCooldown;

export const attack = (
  attackerId: string,
  defenderId: string
): AttackResult | void => {
  if (isCharacterOnCooldown(attackerId)) {
    return { outcome: "cooldown" };
  }
  const attacker = getCharacter(attackerId);
  const defender = getCharacter(defenderId);
  if (!attacker || !defender) return;

  db.characters.set(attacker.id, {
    ...attacker,
    lastAction: new Date(),
  });
  const attackRoll = d20();
  const damage = d6();
  if (attackRoll + attacker.attackBonus >= defender.ac) {
    adjustHP(defender.id, -damage);
    return {
      outcome: "hit",
      attackRoll,
      damage,
      attacker: getCharacter(attacker.id) as Character,
      defender: getCharacter(defender.id) as Character,
    };
  }

  return {
    outcome: "miss",
    attackRoll,
    damage,
    attacker: getCharacter(attacker.id) as Character,
    defender: getCharacter(defender.id) as Character,
  };
};

type TrapResult =
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

export const trap = (
  characterId: string,
  attackBonus = 1
): TrapResult | void => {
  const defender = getCharacter(characterId);
  if (!defender) return;
  const attackRoll = d20();
  const damage = d6();
  if (attackRoll + attackBonus > defender.ac) {
    adjustHP(characterId, -damage);
    return { outcome: "hit", attackRoll, attackBonus, damage, defender };
  }
  return { outcome: "miss", attackRoll, attackBonus, damage, defender };
};

type HealResult =
  | { outcome: "healed"; amount: number }
  | { outcome: "cooldown" };

export const heal = (
  initiatorId: string,
  targetId: string
): HealResult | undefined => {
  if (isCharacterOnCooldown(initiatorId)) return { outcome: "cooldown" };

  const healer = getCharacter(initiatorId);
  if (!healer) return;
  db.characters.set(initiatorId, { ...healer, lastAction: new Date() });
  const amount = Math.ceil(Math.random() * 6);
  adjustHP(targetId, amount);
  return { outcome: "healed", amount };
};

export const setProfile = (id: string, url: string): Character | undefined => {
  const character = getCharacter(id);
  if (!character) return;
  db.characters.set(id, { ...character, profile: url });
  return character;
};
