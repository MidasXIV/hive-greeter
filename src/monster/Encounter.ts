import { AttackResult } from "../attack/AttackResult";
import { LootResult } from "../character/loot/loot";

export type Encounter = {
  id: string;
  characterId: string;
  monsterId: string;
  playerAttacks: AttackResult[];
  monsterAttacks: AttackResult[];
  rounds: number;
  date: string;
  goldLooted: number;
  lootResult?: LootResult;
  outcome:
    | "in progress"
    | "player victory"
    | "player defeated"
    | "player fled"
    | "monster fled"
    | "double ko";
};
