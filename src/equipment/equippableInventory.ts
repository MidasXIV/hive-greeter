import { Equippable, isEquippable } from "./equipment";
import { isEquipped } from "./isEquipped";
import { Character } from "../character/Character";

export function equippableInventory(character: Character): Equippable[] {
  return character.inventory
    .filter(isEquippable)
    .filter((item) => !isEquipped({ character, item }));
}
