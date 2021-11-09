import { Character } from "./Character";
import { Stat } from "../gameState";
import { getCharacterStatModifier } from "./getCharacterStatModifier";

export const getCharacterStatModified = (
  character: Character,
  stat: Stat
): number => {
  if (stat === "damageMax")
    return character.equipment.weapon?.damageMax ?? character.damageMax;
  return character[stat] + getCharacterStatModifier(character, stat);
};
