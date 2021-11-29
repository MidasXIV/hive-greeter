import { Item } from "./Item";
import { equipmentFilter } from "../character/loot/loot";
import { values } from "remeda";
import { Character } from "../character/Character";

export function isEquipped({
  character,
  item,
}: {
  character: Character;
  item: Item;
}): boolean {
  return (
    values(equipmentFilter(character.equipment, (i) => i.id === item.id))
      .length > 0
  );
}
