import { randomUUID } from "crypto";

type Character = {
  id: string;
  hp: number;
  maxHP: number;
  ac: number;
  lastAction?: Date;
  level: number;
  attackBonus: number;
  profile?: string;
};

type DB = {
  characters: Map<string, Character>;
};

const db: DB = { characters: new Map() };

export const getHP = (characterId: string): number =>
  getCharacter(characterId).hp;
export const getMaxHP = (characterId: string): number =>
  getCharacter(characterId).maxHP;

export const levelup = (characterId: string): void => {
  const character = getCharacter(characterId);
  db.characters.set(characterId, {
    ...character,
    maxHP: character.maxHP + 1,
    hp: character.hp + 1,
  });
};

export const getCharacter = (id: string): Character => {
  const character = db.characters.get(id);
  if (!character) {
    return createCharacter({ id });
  }
  return character;
};

export const setCooldown = (characterId: string): Character => {
  const character = getCharacter(characterId);
  db.characters.set(characterId, { ...character, lastAction: new Date() });
  return character;
};

export const createCharacter = (character?: Partial<Character>): Character => {
  const newCharacter: Character = {
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

export const adjustHP = (characterId: string, amount: number): Character => {
  const character = getCharacter(characterId);

  let newHp = character.hp + amount;
  if (newHp < 0) newHp = 0;
  if (newHp > character.maxHP) newHp = character.maxHP;

  db.characters.set(characterId, {
    ...character,
    hp: newHp,
  });
  return getCharacter(characterId);
};

export const isCharacterOnCooldown = (characterId: string): boolean => {
  const cooldown = 1000;
  const character = getCharacter(characterId);
  return Boolean(
    character.lastAction &&
      cooldown > Date.now() - character.lastAction.valueOf()
  );
};

type AttackResult =
  | { outcome: "hit"; attackRoll: number; damage: number }
  | { outcome: "miss"; attackRoll: number };
// | { outcome: "cooldown" };

const d20 = () => Math.ceil(Math.random() * 20);
const d6 = () => Math.ceil(Math.random() * 6);

export const attack = (
  attackerId: string,
  defenderId: string
): AttackResult => {
  const attacker = getCharacter(attackerId);
  const defender = getCharacter(defenderId);
  // if (isCharacterOnCooldown(attackerId)) {
  //   return { outcome: "cooldown" };
  // }
  db.characters.set(attackerId, { ...attacker, lastAction: new Date() });
  const attackRoll = d20();
  if (attackRoll + attacker.attackBonus > defender.ac) {
    const damage = d6();
    adjustHP(defenderId, -damage);
    return { outcome: "hit", damage, attackRoll };
  }
  return { outcome: "miss", attackRoll };
};

type TrapResult =
  | { outcome: "hit"; attack: number; damage: number }
  | { outcome: "miss"; attack: number };

export const trap = (characterId: string): TrapResult => {
  const attack = d20();
  if (attack > 10) {
    const damage = d6();
    adjustHP(characterId, -damage);
    return { outcome: "hit", attack, damage };
  }
  return { outcome: "miss", attack };
};

type HealResult =
  | { outcome: "healed"; amount: number }
  | { outcome: "cooldown" };

export const heal = (initiatorId: string, targetId: string): HealResult => {
  if (isCharacterOnCooldown(initiatorId)) return { outcome: "cooldown" };

  const healer = getCharacter(initiatorId);
  db.characters.set(initiatorId, { ...healer, lastAction: new Date() });
  const amount = Math.ceil(Math.random() * 6);
  adjustHP(targetId, amount);
  return { outcome: "healed", amount };
};

export const setProfile = (id: string, url: string): Character | undefined => {
  const character = db.characters.get(id);
  if (!character) return;
  db.characters.set(id, { ...character, profile: url });
  return character;
};
