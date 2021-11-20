import { Character } from "../character/Character";

export type HealResult =
  | { outcome: "healed"; amount: number; target: Character; rawHeal: number }
  | { outcome: "cooldown" };
