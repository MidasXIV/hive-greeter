import { updateCharacter } from "../character/updateCharacter";
import { equipmentFilter } from "../character/loot/loot";
import { Character } from "../character/Character";

export function removeItemIdFromCharacter({
  character,
  itemId,
}: {
  character: Character;
  itemId: string;
}): Character | void {
  return updateCharacter({
    ...character,
    equipment: equipmentFilter(character.equipment, (i) => itemId !== i.id),
    inventory: character.inventory.filter((i) => i.id !== itemId),
  });
}
