import { Monster } from "@adventure-bot/monster/Monster";
import { Character } from "@adventure-bot/character/Character";

import store from '@adventure-bot/store'
import { updateCharacter as doUpdateCharacter } from "@adventure-bot/store/slices/characters";
import { updateMonster as doUpdateMonster } from "@adventure-bot/store/slices/monsters";
import { getCharacterById, getMonsterById } from "@adventure-bot/store/selectors";
const isMonster = (character: Character): character is Monster =>
  character.isMonster ?? false;

export const updateCharacter = (
  character: Character | void
): Character | void => {
  if (!character) return;

  if (isMonster(character)) {
    store.dispatch(doUpdateMonster(character))
    return getCharacterById(store.getState(), character.id)
  } else {
    
    store.dispatch(doUpdateCharacter(character))
    return getMonsterById(store.getState(), character.id)
  }
  return character
};
