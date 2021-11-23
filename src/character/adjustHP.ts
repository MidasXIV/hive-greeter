import { Character } from "../character/Character";
import { getCharacter } from "../character/getCharacter";
import store from '../store'
import { adjustCharacterHP } from "../store/slices/characters";

export const adjustHP = (
  characterId: string,
  amount: number
): Character | void => {
  const character = getCharacter(characterId);
  if (!character) {
    console.error(`adjustHP could not find characterId: ${characterId}`);
    return;
  }
  store.dispatch(adjustCharacterHP({ character, amount }));
  return getCharacter(characterId);
};
