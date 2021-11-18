import { Character } from "./Character";
import { getCharacter } from "./getCharacter";
import store from '../store'
import { updateGold } from '../store/slices/characters'

export const setGold = (
  characterId: string,
  amount: number
): Character | void => {
  const character = getCharacter(characterId);
  if (!character) return;
  updateGold({
    character,
    gold: amount,
  });
  return getCharacter(characterId);
};
