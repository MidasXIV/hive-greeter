import { ColorResolvable } from "discord.js";
import { StatusEffect } from "../statusEffects/StatusEffect";

type Mutable<T> = {
  -readonly [k in keyof T]: T[k];
};
export type Shrine = {
  id: string;
  name: string;
  effect: StatusEffect;
  description: string;
  image: string;
  color: Mutable<ColorResolvable>;
};
