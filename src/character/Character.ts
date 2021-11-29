import { User } from "discord.js";
import { Armor, Hat, Shield, Weapon } from "../equipment/equipment";
import { Item } from "../equipment/Item";
import { Quest } from "../quest/Quest";
import { QuestId } from "../quest/quests";
import { StatusEffect } from "../statusEffects/StatusEffect";
import { Stats } from "./Stats";

type x = Item["type"];
type y = Map<Item["type"], Item>;

export type Character = Stats & {
  id: string;
  name: string;
  profile: string;
  user?: User;
  hp: number;

  inventory: Item[];
  equipment: {
    weapon?: Weapon;
    armor?: Armor;
    shield?: Shield;
    hat?: Hat;
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
