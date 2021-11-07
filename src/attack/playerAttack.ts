import { attack } from "./attack";
import { setCharacterCooldown } from "../gameState";
import { isCharacterOnCooldown } from "../character/isCharacterOnCooldown";
import { AttackResult } from "./AttackResult";

export const playerAttack = (
  attackerId: string,
  defenderId: string
): AttackResult | void => {
  if (isCharacterOnCooldown(attackerId, "attack")) {
    return { outcome: "cooldown" };
  }
  const result = attack(attackerId, defenderId);
  if (result && result.outcome !== "cooldown")
    setCharacterCooldown(attackerId, "attack");
  return result;
};
