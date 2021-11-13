import { Character } from "./character/Character";
import { Item } from "./utils/equipment";

export const equipItem = (character: Character, item: Item): Character => ({
  ...character,
  equipment: {
    ...character.equipment,
    [item.type]: item,
  },
});
