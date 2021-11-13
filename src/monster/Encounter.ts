import { AttackResult } from "../attack/AttackResult";

export type Encounter = {
  id: string;
  characterId: string;
  monsterId: string;
  playerAttacks: AttackResult[];
  monsterAttacks: AttackResult[];

  date: string;
  inProgress: boolean;
  result?: "victory" | "defeat" | "retreat" | "monster fled";
};
