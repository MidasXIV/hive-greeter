import { AttackResult } from "../attack/AttackResult";

export type Encounter = {
  id: string;
  characterId: string;
  monsterId: string;
  playerAttacks: AttackResult[];
  monsterAttacks: AttackResult[];
  rounds: number;
  date: string;
  outcome:
    | "in progress"
    | "player victory"
    | "player defeated"
    | "player fled"
    | "monster fled"
    | "double ko";
};
