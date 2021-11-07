import { Character } from "./Character";
import { Stat } from "../gameState";
import { getCharacterStatModifier } from "./getCharacterStatModifier";

export const getCharacterStatModified = (
  character: Character,
  stat: Stat
): number => character[stat] + getCharacterStatModifier(character, stat);
