import { Character } from "./Character";
import { defaultProfile } from "../fixtures";

export const defaultCharacter: Omit<Character, "id" | "name"> = {
  profile: defaultProfile,
  inventory: [],
  gold: 0,
  hp: 10,
  maxHP: 10,
  ac: 10,
  attackBonus: 1,
  damageBonus: 0,
  monsterDamageMax: 0,
  equipment: {},
  cooldowns: {},
  statusEffects: [],
  quests: {},
  xp: 0,
  xpValue: 10,
  damageMax: 4,
};
