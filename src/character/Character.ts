import { User } from "discord.js";
import { Quest } from "../quest/Quest";
import { QuestId } from "../quest/quests";
import { StatusEffect } from "../statusEffects/StatusEffect";
import { Item, Weapon } from "../equipment/equipment";
import { Stats } from "./Stats";
import { Encounter } from "../monster/Encounter";

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
    renew?: string;
  };
  statusEffects?: StatusEffect[];
  quests: {
    [id in QuestId]?: Quest;
  };
  encounters: Encounter[];

  xp: number;
  gold: number;
  xpValue: number;
};
