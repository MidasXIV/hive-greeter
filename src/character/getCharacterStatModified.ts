import { Character } from "../character/Character";
import { getCharacterStatModifier } from "../character/getCharacterStatModifier";
import { Stat } from "../character/Stats";

export const getCharacterStatModified = (
  character: Character,
  stat: Stat
): number => {
  if (stat === "damageMax")
    return character.equipment.weapon?.damageMax ?? character.damageMax;
  return character[stat] + getCharacterStatModifier(character, stat);
};
