import { Character } from "../character/Character";
import { equipmentFilter } from "../character/loot/loot";
import { updateCharacter } from "../character/updateCharacter";
import { Item } from "./Item";

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
    gold: character.gold + 0.8 * item.goldValue, // TODO: variable conversion rate
  });
}
