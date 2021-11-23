import { Monster } from "../monster/Monster";
import { Character } from "../character/Character";

import store from '../store'
import { updateCharacter as doUpdateCharacter } from "../store/slices/characters";
import { updateMonster as doUpdateMonster } from "../store/slices/monsters";
import { getCharacterById, getMonsterById } from "../store/selectors";
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
