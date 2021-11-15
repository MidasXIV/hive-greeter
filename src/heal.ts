import { isCharacterOnCooldown } from "./character/isCharacterOnCooldown";
import { getCharacter } from "./character/getCharacter";
import { adjustHP } from "./character/adjustHP";
import { setCharacterCooldown } from "./character/setCharacterCooldown";
import { d6 } from "./gameState";
import { HealResult } from "./HealResult";

export const heal = (
  initiatorId: string,
  targetId: string
): HealResult | undefined => {
  if (isCharacterOnCooldown(initiatorId, "heal"))
    return { outcome: "cooldown" };
  const healer = getCharacter(initiatorId);
  getCharacter(targetId);
  if (!healer) return;
  setCharacterCooldown(healer.id, "heal");
  const amount = d6();
  adjustHP(targetId, amount);
  const target = getCharacter(targetId);
  if (!target) return;
  return { outcome: "healed", amount, target };
};
