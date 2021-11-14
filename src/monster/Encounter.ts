import { AttackResult } from "../attack/AttackResult";

export type Encounter = {
  id: string;
  characterId: string;
  monsterId: string;
  playerAttacks: AttackResult[];
  monsterAttacks: AttackResult[];
  rounds: number;
  date: string;
  status: "in progress" | "victory" | "defeat" | "retreat" | "monster fled";
};
