import { User } from "discord.js";
import { StatusEffect } from "../status-effets/StatusEffect";
import { Item, Weapon } from "../utils/equipment";
import { Stats } from "./Stats";

export type Character = Stats & {
  id: string;
  name: string;
  profile: string;
  user?: User;
  hp: number;

  inventory: Item[];
  equipment: {
    weapon?: Weapon;
  };

  cooldowns: {
    attack?: string;
    adventure?: string;
    heal?: string;
  };
  statusEffects?: StatusEffect[];

  xp: number;
  gold: number;
  xpValue: number;
};
