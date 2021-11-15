import { Character } from "./Character";
import { getCharacter } from "./getCharacter";
import { updateCharacter } from "./updateCharacter";

export const adjustGold = (
  characterId: string,
  amount: number
): Character | void => {
  const character = getCharacter(characterId);
  if (!character) return;
  updateCharacter({
    ...character,
    gold: character.gold + amount,
  });
  return getCharacter(characterId);
};
