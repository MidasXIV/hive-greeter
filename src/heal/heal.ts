import { isCharacterOnCooldown } from "../character/isCharacterOnCooldown";
import { getCharacter } from "../character/getCharacter";
import { adjustHP } from "../character/adjustHP";
import { setCharacterCooldown } from "../character/setCharacterCooldown";
import { d6 } from "../utils/dice";
import { HealResult } from "./HealResult";
import { getCharacterStatModified } from "../character/getCharacterStatModified";
import { clamp } from "remeda";

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
  const rawHeal = d6();
  const targetBeforeHeal = getCharacter(targetId);
  if (!targetBeforeHeal) return;
  const missingHealth =
    getCharacterStatModified(targetBeforeHeal, "maxHP") - targetBeforeHeal.hp;
  const actualHeal = clamp(rawHeal, { max: missingHealth });
  adjustHP(targetId, rawHeal);
  const target = getCharacter(targetId);
  if (!target) return;
  return { outcome: "healed", amount: actualHeal, rawHeal, target };
};
