import { ColorResolvable } from "discord.js";
import { StatusEffect } from "../statusEffects/StatusEffect";

export type Shrine = {
  id: string;
  name: string;
  effect: StatusEffect;
  description: string;
  image: string;
  color: ColorResolvable;
};
