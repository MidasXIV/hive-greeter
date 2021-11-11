import { Stats } from "../character/Stats";

export type StatusEffect = {
  name: string;
  // image: string; // TODO
  started: string;
  duration: number;
  modifiers: Partial<Stats>;
  buff: boolean;
  debuff: boolean;
};
