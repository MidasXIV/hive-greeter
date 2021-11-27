import { StatModifier } from "../statusEffects/StatModifier";

export type Item = {
  type: "weapon" | "armor" | "shield" | "hat";
  name: string;
  description: string;
  goldValue: number;
  modifiers?: StatModifier;
  equippable: boolean;
  lootable?: boolean;
};
