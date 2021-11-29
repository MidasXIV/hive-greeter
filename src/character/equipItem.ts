import { Item } from "../equipment/Item";
import { Character } from "./Character";

export const equipItem = (character: Character, item: Item): Character => ({
  ...character,
  equipment: {
    ...character.equipment,
    [item.type]: item,
  },
});
