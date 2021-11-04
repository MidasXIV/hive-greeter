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
  level: number;
  attackBonus: number;
  profile: string;
  user?: User;
  cooldowns: {
    attack?: string;
    adventure?: string;
    heal?: string;
  };
  xp: number;
  xpValue: number;
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

export const defaultProfile = "attachment://profile.png";

export const grantDivineBlessing = (characterId: string): void => {
  const character = getCharacter(characterId);
  if (!character) return;
  db.characters.set(characterId, {
    ...character,
    maxHP: character.maxHP + 1,
    hp: character.hp + 1,
  });
};

export const getUserCharacters = (): Character[] =>
  Array.from(db.characters.values()).filter((character) => character.user);

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
  characterId: string,
  type: keyof Character["cooldowns"]
): Character | undefined => {
  const character = getCharacter(characterId);
  if (!character) return;
  const updatedCharacter = {
    ...character,
    cooldowns: { ...character.cooldowns, [type]: new Date().toString() },
  };
  db.characters.set(characterId, updatedCharacter);
  return getCharacter(characterId);
};

export const isCharacterOnCooldown = (
  characterId: string,
  type: keyof Character["cooldowns"]
): boolean => (getCooldownRemaining(characterId, type) ?? 0) > 0;

export const getCooldownRemaining = (
  characterId: string,
  type: keyof Character["cooldowns"]
): number => {
  try {
    const cooldown = 5 * 60000; //5m
    const lastUsed = db.characters.get(characterId)?.cooldowns[type];
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
    profile: defaultProfile,
    id: character?.id || randomUUID(),
    hp: 10,
    ac: 10,
    maxHP: 10,
    level: 1,
    attackBonus: 1,
    cooldowns: {},
    xp: 0,
    xpValue: 5,
    ...character,
  };
  db.characters.set(newCharacter.id, newCharacter);
  console.log(`created ${newCharacter.id}`);
  return newCharacter;
};

export const gainXP = (
  characterId: string,
  amount: number
): Character | undefined => {
  const character = getCharacter(characterId);
  if (!character) return undefined;
  db.characters.set(characterId, { ...character, xp: character.xp + amount });
  return getCharacter(characterId);
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
  const attacker = getCharacter(attackerId);
  const defender = getCharacter(defenderId);
  if (!attacker || !defender) return;

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

export const attackPlayer = (
  attackerId: string,
  defenderId: string
): AttackResult | void => {
  if (isCharacterOnCooldown(attackerId, "attack")) {
    return { outcome: "cooldown" };
  }
  const result = attack(attackerId, defenderId);
  if (result && result.outcome !== "cooldown")
    setCharacterCooldown(attackerId, "attack");
  return result;
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

export const setProfile = (id: string, url: string): Character | undefined => {
  const character = getCharacter(id);
  if (!character) return;
  db.characters.set(id, { ...character, profile: url });
  return character;
};
