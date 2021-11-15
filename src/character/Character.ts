import { User } from "discord.js";
import { Item, Weapon } from "../equipment/equipment";
import { Quest } from "../quest/Quest";
import { QuestId } from "../quest/quests";
import { StatusEffect } from "../statusEffects/StatusEffect";
import { Stats } from "./Stats";

export type Character = Stats & {
  id: string;
  name: string;
  profile: string;
  user?: Pick<User, 'id'>;
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

  xp: number;
  gold: number;
  xpValue: number;
  isMonster?: boolean;
};
