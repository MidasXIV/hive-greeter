import { Character } from "../character/Character";
import { equipmentFilter } from "../character/loot/loot";
import { updateCharacter } from "../character/updateCharacter";
import { Item } from "./Item";

export function dropItem({
  character,
  item,
}: {
  character: Character;
  item: Item;
}): void {
  updateCharacter({
    ...character,
    equipment: equipmentFilter(character.equipment, (i) => i.id !== item.id),
  });
}
