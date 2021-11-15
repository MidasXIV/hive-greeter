import { randomUUID } from "crypto";
import { getCharacter } from "../getCharacter";
import { updateCharacter } from "../updateCharacter";

export type LootResult = {
  id: string;
  goldTaken: number;
  looterId: string;
  targetId: string;
};

/**
 * @TODO: refactor `../../commands/encounters/monster.ts` to use this
 */
export function loot({
  looterId,
  targetId,
}: {
  looterId: string;
  targetId: string;
}): LootResult | void {
  const looter = getCharacter(looterId);
  const target = getCharacter(targetId);
  if (!looter || !target) {
    console.error("loot failed");
    return;
  }
  const goldTaken = target.gold;
  updateCharacter({
    ...looter,
    gold: looter.gold + goldTaken,
    xp: looter.xp + target.xpValue,
  });
  updateCharacter({
    ...target,
    gold: 0,
  });
  return {
    id: randomUUID(),
    goldTaken,
    looterId: looter.id,
    targetId: target.id,
  };
}
