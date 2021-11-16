import { Character } from "../character/Character";

export type TrapResult =
  | {
      outcome: "hit";
      attackRoll: number;
      attackBonus: number;
      damage: number;
      defender: Character;
    }
  | {
      outcome: "miss";
      attackRoll: number;
      attackBonus: number;
      damage: number;
      defender: Character;
    };
