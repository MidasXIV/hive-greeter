import { Character } from "./character/Character";
import { getCharacter } from "./character/getCharacter";
import { updateCharacter } from "./updateCharacter";

export const setGold = (
  characterId: string,
  amount: number
): Character | void => {
  const character = getCharacter(characterId);
  if (!character) return;
  updateCharacter({
    ...character,
    gold: amount,
  });
  return getCharacter(characterId);
};
