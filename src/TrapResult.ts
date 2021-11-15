import { Character } from "./character/Character";

export type TrapResult = {
  outcome: "hit" | "miss";
  attackRoll: number;
  attackBonus: number;
  damage: number;
  defender: Character;
}