export const stats = [
  "ac",
  "attackBonus",
  "damageBonus",
  "damageMax",
  "maxHP",
  "monsterDamageMax",
] as const;

export type Stat = typeof stats[number];

export type Stats = {
  [key in Stat]: number;
};

export const statTitles: { [key in Stat]: string } = {
  ac: "Armor",
  attackBonus: "Attack Bonus",
  damageBonus: "Damage Bonus",
  damageMax: "Damage Max",
  maxHP: "Max Health",
  monsterDamageMax: "Monster Damage Max",
};
