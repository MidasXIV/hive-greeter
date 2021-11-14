import { AttackResult } from "../attack/AttackResult";

export type Encounter = {
  id: string;
  characterId: string;
  monsterId: string;
  playerAttacks: AttackResult[];
  monsterAttacks: AttackResult[];
  rounds: number;
  date: string;
  inProgress: boolean;
  result?: "victory" | "defeat" | "retreat" | "monster fled";
};
