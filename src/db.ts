import { randomUUID } from "crypto";
import { MessageAttachment, User } from "discord.js";
import { readFile, writeFile } from "fs/promises";

export const DB_FILE = "./db.json";

export type Character = {
  id: string;
  name: string;
  profile: string;
  user?: User;
  hp: number;
  maxHP: number;
  ac: number;
  attackBonus: number;
  cooldowns: {
    attack?: string;
    adventure?: string;
    heal?: string;
  };
  statModifiers?: StatModifier[];
  xp: number;
  gold: number;
  xpValue: number;
};

const defaultCharacter: Partial<Character> = {
  gold: 0,
  hp: 10,
  ac: 10,
  cooldowns: {},
  statModifiers: [],
  xp: 0,
  xpValue: 10,
};

export type StatModifier = {
  name: string;
  started: string;
  duration: number;
  modifiers: Partial<{
    ac: number;
    attackBonus: number;
  }>;
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
  const parsed = JSON.parse(serialized);
  const characters = parsed.characters.map((character: Character) => ({
    ...defaultCharacter,
    ...character,
  }));

  db.characters = new Map(characters);
  console.log("Database loaded", db);
  return db;
};

export const defaultProfile = "attachment://profile.png";
export const defaultProfileAttachment = new MessageAttachment(
  "./images/default-profile.png",
  "profile.png"
);

export type Stat = "ac" | "attackBonus";
export const getCharacterStat = (character: Character, stat: Stat): number =>
  character[stat];
export const getCharacterStatModified = (
  character: Character,
  stat: Stat
): number => character[stat] + getCharacterStatModifier(character, stat);

export const getCharacterStatModifier = (
  character: Character,
  stat: Stat
): number =>
  (character.statModifiers || []).reduce(
    (acc, effect) => acc + (effect.modifiers[stat] || 0),
    0
  );

export const grantStatusEffect = (
  characterId: string,
  effect: StatModifier
): Character | void => {
  const character = getCharacter(characterId);
  if (!character) return;
  const updatedCharacter = {
    ...character,
    statModifiers: [...(character.statModifiers || []), effect],
  };
  db.characters.set(characterId, updatedCharacter);
  return getCharacter(characterId);
};

export const grantDivineBlessing = (characterId: string): void => {
  const character = getCharacter(characterId);
  if (!character) return;
  db.characters.set(characterId, {
    ...character,
    maxHP: character.maxHP + 1,
    hp: character.hp + 1,
  });
};

const purgeExpiredStatuses = (characterId: string): void => {
  const character = db.characters.get(characterId);
  if (!character) return;
  db.characters.set(characterId, {
    ...character,
    statModifiers:
      character.statModifiers?.filter(
        (effect) => !isStatusEffectExpired(effect)
      ) ?? [],
  });
  console.log(`${characterId} status effects purged`);
};

const isStatusEffectExpired = (effect: StatModifier): boolean =>
  Date.now() > new Date(effect.started).valueOf() + effect.duration;

export const getUserCharacters = (): Character[] =>
  Array.from(db.characters.values()).filter((character) => character.user);

export const getCharacter = (id: string): Character | void => {
  purgeExpiredStatuses(id);
  return db.characters.get(id);
};

export const getUserCharacter = (user: User): Character => {
  purgeExpiredStatuses(user.id);
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
): Character | void => {
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
    attackBonus: 1,
    cooldowns: {},
    statModifiers: [],
    xp: 0,
    xpValue: 5,
    gold: 0,
    ...character,
  };
  db.characters.set(newCharacter.id, newCharacter);
  console.log(`created ${newCharacter.id}`);
  return newCharacter;
};

export const awardXP = (
  characterId: string,
  amount: number
): Character | void => {
  const character = getCharacter(characterId);
  if (!character) return undefined;
  db.characters.set(characterId, {
    ...character,
    xp: character.xp + amount,
  });
  return getCharacter(characterId);
};

export const awardGold = (
  characterId: string,
  amount: number
): Character | void => {
  const character = getCharacter(characterId);
  if (!character) return;
  db.characters.set(characterId, {
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
  db.characters.set(characterId, {
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
  if (
    attackRoll + attacker.attackBonus >=
    getCharacterStatModifier(defender, "ac")
  ) {
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
  if (attackRoll + attackBonus > getCharacterStatModified(defender, "ac")) {
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
