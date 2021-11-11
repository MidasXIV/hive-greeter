import { Character } from "../character/Character";
import { Item } from "../utils/equipment";

export const grantCharacterItem = (
  character: Character,
  item: Item
): Character => ({
  ...character,
  inventory: [...character.inventory, item],
});
