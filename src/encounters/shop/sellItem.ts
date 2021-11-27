import { Character } from "../../character/Character";
import { equipmentFilter } from "../../character/loot/loot";
import { updateCharacter } from "../../character/updateCharacter";
import { Item } from "../../equipment/Item";

export function sellItem({
  character,
  item,
  percent,
}: {
  character: Character;
  item: Item;
  percent: number;
}): void {
  updateCharacter({
    ...character,
    equipment: equipmentFilter(character.equipment, (i) => i.id !== item.id),
    gold: character.gold + percent * item.goldValue,
  });
}
