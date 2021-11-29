import { Character } from "../../character/Character";
import { equipmentFilter } from "../../character/loot/loot";
import { updateCharacter } from "../../character/updateCharacter";
import { Item } from "../../equipment/Item";
import { sellValue } from "./sellValue";

export function sellItem({
  character,
  item,
}: {
  character: Character;
  item: Item;
}): void {
  updateCharacter({
    ...character,
    equipment: equipmentFilter(character.equipment, (i) => i.id !== item.id),
    inventory: character.inventory.filter((i) => i.id !== item.id),
    gold: character.gold + sellValue(item),
  });
}
