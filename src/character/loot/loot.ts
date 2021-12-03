import { randomUUID } from "crypto";
import { values } from "remeda";
import { looted } from "../../store/slices/loots";
import { Character } from "../Character";
import { getCharacter } from "../getCharacter";
import store from "../../store";
import { Item } from "../../equipment/Item";
import { characterLooted } from "../../store/slices/characters";

export type LootResult = {
  id: string;
  itemsTaken: Item[];
  goldTaken: number;
  looterId: string;
  targetId: string;
  timestamp: string;
};

const isLootable = (item: Item): boolean => item.lootable ?? false;

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
  const loot: LootResult = {
    id: randomUUID(),
    goldTaken: target.gold,
    itemsTaken: target.inventory.filter(isLootable),
    looterId: looter.id,
    targetId: target.id,
    timestamp: new Date().toString(),
  };

  store.dispatch(looted(loot));
  store.dispatch(characterLooted(loot));
  return loot;
}

export const equipmentFilter = (
  equipment: Character["equipment"],
  predicate: (item: Item) => boolean
): Character["equipment"] =>
  values(equipment)
    .filter(predicate)
    .reduce(
      (equipment, item) => ({
        ...equipment,
        [item.type]: item,
      }),
      {}
    );
