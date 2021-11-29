import { Character } from "../character/Character";
import { Equippable, isEquippable } from "../equipment/equipment";
import { isEquipped } from "../equipment/isEquipped";

export const equippableInventory = (character: Character): Equippable[] =>
  character.inventory
    .filter((item) => !isEquipped({ character, item }))
    .filter(isEquippable);
