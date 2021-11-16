import { randomUUID } from "crypto";
import { Item } from "../../equipment/equipment";
import { gameState } from "../../gameState";
import { getCharacter } from "../getCharacter";
import { updateCharacter } from "../updateCharacter";

export type LootResult = {
  id: string;
  itemsTaken: Item[];
  goldTaken: number;
  looterId: string;
  targetId: string;
};

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
    console.error(`loot failed looterId:${looterId} targetId:${targetId}`);
    return;
  }
  const goldTaken = target.gold;
  const equipment = Object.values(target.equipment);
  const itemsTaken = equipment.filter((item) => item.lootable);
  const itemsLeft = equipment.filter((item) => item.lootable);
  updateCharacter({
    ...looter,
    gold: looter.gold + goldTaken,
    xp: looter.xp + target.xpValue,
    inventory: [...looter.inventory, ...itemsTaken],
  });
  updateCharacter({
    ...target,
    gold: 0,
    inventory: itemsLeft,
  });
  const loot: LootResult = {
    id: randomUUID(),
    goldTaken,
    itemsTaken,
    looterId: looter.id,
    targetId: target.id,
  };
  gameState.loots.set(loot.id, loot);
  return loot;
}
