import { AttackResult } from "../../attack/AttackResult";

export const averageRoll = (attacks: AttackResult[]): number =>
  attacks.reduce(
    (total, attack) =>
      total + (attack.outcome !== "cooldown" ? attack.attackRoll : 0),
    0
  ) / attacks.length;
