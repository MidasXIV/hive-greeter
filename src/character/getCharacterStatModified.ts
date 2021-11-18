import { Character } from "@adventure-bot/character/Character";
import { getCharacterStatModifier } from "@adventure-bot/character/getCharacterStatModifier";
import { Stat } from "@adventure-bot/character/Stats";

export const getCharacterStatModified = (
  character: Character,
  stat: Stat
): number => {
  if (stat === "damageMax")
    return character.equipment.weapon?.damageMax ?? character.damageMax;
  return character[stat] + getCharacterStatModifier(character, stat);
};
