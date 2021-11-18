import { Character } from "@adventure-bot/character/Character";
import { getCharacter } from "@adventure-bot/character/getCharacter";
import store from '@adventure-bot/store'
import { adjustCharacterHP } from "@adventure-bot/store/slices/characters";

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
