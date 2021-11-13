import { updateCharacter } from "../updateCharacter";
import { Character } from "./Character";
import { getCharacter } from "./getCharacter";

export const awardXP = (
  characterId: string,
  amount: number
): Character | void => {
  const character = getCharacter(characterId);
  if (!character) return undefined;
  updateCharacter({
    ...character,
    xp: character.xp + amount,
  });
  return getCharacter(characterId);
};
