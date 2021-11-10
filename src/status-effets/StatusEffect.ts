import { Stats } from "../character/Stats";

export type StatusEffect = {
  name: string;
  started: string;
  duration: number;
  modifiers: Partial<Stats>;
  buff: boolean;
  debuff: boolean;
};
