import { randomUUID } from "crypto";
import { values } from "remeda";
import { Item } from "../../equipment/equipment";
import { gameState } from "../../gameState";
import { Character } from "../Character";
import { getCharacter } from "../getCharacter";
import { updateCharacter } from "../updateCharacter";

export type LootResult = {
  id: string;
  itemsTaken: Item[];
  goldTaken: number;
  looterId: string;
  targetId: string;
  timestamp: string;
};

const isLootable = (item: Item): boolean => item.lootable ?? false;
const isNotLootable = (item: Item): boolean => !isLootable(item);

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
  const itemsTaken = target.inventory.filter(isLootable);

  updateCharacter({
    ...looter,
    gold: looter.gold + goldTaken,
    // TODO: equip taken items
    equipment: autoEquip(looter.equipment), // TODO: add itemsTaken
    xp: looter.xp + target.xpValue,
    inventory: [...looter.inventory, ...itemsTaken],
  });
  updateCharacter({
    ...target,
    gold: 0,
    equipment: equipmentFilter(target.equipment, isNotLootable),
    inventory: target.inventory.filter(isNotLootable),
  });
  const loot: LootResult = {
    id: randomUUID(),
    goldTaken,
    itemsTaken,
    looterId: looter.id,
    targetId: target.id,
    timestamp: new Date().toString(),
  };
  console.log(`${looter.name} loots ${target.name}`, loot);
  gameState.loots.set(loot.id, loot);
  return loot;
}

const autoEquip = (
  equipment: Character["equipment"]
  // items: Item[] // TODO: implement this
): Character["equipment"] => {
  return equipment;
};

/**
 * Equipment minus lootables.
 */
const equipmentFilter = (
  equipment: Character["equipment"],
  predicate: (item: Item) => boolean
) =>
  values(equipment)
    .filter(predicate)
    .reduce(
      (equipment, item) => ({
        ...equipment,
        [item.type]: item,
      }),
      {}
    );
