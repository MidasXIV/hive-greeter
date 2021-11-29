import { StatModifier } from "../statusEffects/StatModifier";

export type Item = {
  id: string;
  type: "weapon" | "armor" | "shield" | "hat";
  name: string;
  description: string;
  goldValue: number;
  modifiers?: StatModifier;
  equippable: boolean;
  lootable?: boolean;
  sellable?: boolean;
  tradeable?: boolean;
};
