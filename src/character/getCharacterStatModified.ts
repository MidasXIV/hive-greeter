import { Character } from "./Character";
import { getCharacterStatModifier } from "./getCharacterStatModifier";
import { Stat } from "./Stats";

export const getCharacterStatModified = (
  character: Character,
  stat: Stat
): number => {
  if (stat === "damageMax")
    return character.equipment.weapon?.damageMax ?? character.damageMax;
  return character[stat] + getCharacterStatModifier(character, stat);
};
