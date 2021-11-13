import { Character } from "./Character";
import { Item } from "../equipment/equipment";
import { Stat } from "./Stats";

export const getEquipmentStatModifier = (
  character: Character,
  stat: Stat
): number =>
  Object.values(character.equipment).reduce(
    (acc, item: Item) => acc + (item.modifiers?.[stat] ?? 0),
    0
  );
