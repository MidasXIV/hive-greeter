import { Character } from "../character/Character";
import { gameState } from "../gameState";
import { Item } from "./Item";

export const grantCharacterItem = (
  character: Character,
  item: Item
): Character => {
  if (item.name === "heavy crown") {
    gameState.isHeavyCrownInPlay = true;
  }
  return {
    ...character,
    inventory: [...character.inventory, item],
  };
};
